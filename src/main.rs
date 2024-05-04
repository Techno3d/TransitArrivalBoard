mod siri_structs;

use std::collections::{BTreeMap, HashMap};

use std::net::TcpListener;
use std::sync::{Arc, RwLock};
use std::thread;
use std::time::Duration;

use gtfs_structures::Route;
use serde::{Deserialize, Serialize};
use transit_board::config::Config;
use transit_board::feed_handler::FeedHandler;
use transit_board::{Alert, Stop};
use tungstenite::protocol::frame::coding::CloseCode;
use tungstenite::protocol::CloseFrame;
use tungstenite::Message;

fn main() {
  dotenvy::dotenv().expect("Dotenv not found, check that it exists or else board will not be able to use some MTA data (bus data)\n.env file should be located in the directory where you call the server, or a parent directory");
  let api_key_bus = Arc::new(std::env::var("MTABUSKEY").expect("The bus API key must be defined in the environment or .env for the board to access some MTA data"));

  let server = TcpListener::bind("0.0.0.0:9001").expect("Server failed to start, is port already in use?");

  for stream in server.incoming() {
      let api_key_bus = api_key_bus.to_owned();
      let spawn = thread::spawn(move || {
        let stream = match stream {
          Ok(stream) => stream,
          Err(_) => return, // If stream fails to connect, don't crash
      };
      let mut ws = match tungstenite::accept(stream) {
          Ok(ws) => ws,
          Err(_) => return, // if not a websocket, don't crash
      };

      let config: Result<Config, serde_json::Error> = match ws.read() {
        Ok(c) => serde_json::from_str(c.to_text().unwrap_or("")),
        Err(_) => Ok(Config::new(Vec::new(), Vec::new())),
      };
      let config: Config = match config {
        Ok(a) => a,
        Err(_) => {
          _ = ws.close(Some(CloseFrame {
            code: CloseCode::Error,
            reason: "The config that was sent is malformed".into(),
          }));
          return;
        } // Just close connection on incorrect data
      };

      let data = Arc::new(RwLock::new(FeedHandler::default()));
      data.write().unwrap().refresh_static(); // Should be able to write

      let mut subway = config.get_subway_handlers(data.to_owned());
      let mut bus = config.get_bus_handlers(api_key_bus.to_owned(), data.to_owned());
      let mut service_alerts = config.get_service_alerts_handler(data.to_owned());

      let mut stops_map: BTreeMap<String, Stop> = BTreeMap::new();

      loop {
        if !ws.can_write() {
          break;
        }

        stops_map.clear();

        // If we can't aquire write lock, we have problem
        data.write().unwrap().refresh_realtime();

        for i in 0..subway.len() {
          // i must be in subway vector
          subway.get_mut(i).unwrap().refresh();
          stops_map.insert(
            // There should be atleast one stop_id
            subway.get(i).unwrap().stop_ids.first().unwrap().to_owned(),
            subway.get(i).unwrap().serialize(),
          );
        }

        for i in 0..bus.len() {
            // i is within the bus vector length
          bus.get_mut(i).unwrap().refresh();
          stops_map.insert(
            // Atleast one stop_id must exist
            bus.get(i).unwrap().stop_ids.first().unwrap().to_string(),
            bus.get(i).unwrap().serialize(),
          );
        }

        service_alerts.refresh();

        // If lock cannot be acquired, then the data is no longer accessible
        // Application should crash on RwLock poisining
        let feed_data = data.read().unwrap();
        let mut routes_static = feed_data.subway_static_feed.routes.clone();

        // Combines bus static feed data into subway static feed data
        for gtfs in feed_data.bus_static_feed.iter() {
          for (key, value) in gtfs.routes.iter() {
            routes_static.insert(key.to_owned(), value.to_owned());
          }
        }

        let data = InfoJson {
          stops_realtime: stops_map.to_owned(),
          service_alerts_realtime: service_alerts.subway.to_owned(),
          routes_static: routes_static.to_owned(),
        };

        // Should not error, but incase
        let data = match serde_json::to_string(&data) {
            Ok(a) => a,
            Err(_) => { 
                eprintln!("Sent blank data, could not serialize data");
                serde_json::to_string(&InfoJson::default()).unwrap()
            }, // Send blank data
        };
        let message = Message::Text(data);

        match ws.send(message) {
          Ok(_) => {}
          Err(_) => break,
        };

        thread::sleep(Duration::from_secs(60));
      }
    });
  }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct InfoJson {
  stops_realtime: BTreeMap<String, Stop>,
  service_alerts_realtime: Vec<Alert>,
  routes_static: HashMap<String, Route>,
}
