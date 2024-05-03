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
  dotenvy::dotenv().unwrap();
  let api_key_bus = Arc::new(std::env::var("MTABUSKEY").unwrap());

  let server = TcpListener::bind("0.0.0.0:9001").unwrap();

  for stream in server.incoming() {
    let api_key_bus = api_key_bus.to_owned();
    thread::spawn(move || {
      let mut ws = tungstenite::accept(stream.unwrap()).unwrap();

      let config: Result<Config, serde_json::Error> = match ws.read() {
        Ok(c) => serde_json::from_str(c.to_text().unwrap()),
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
      data.write().unwrap().refresh_static();

      let mut subway = config.get_subway_handlers(data.to_owned());
      let mut bus = config.get_bus_handlers(api_key_bus.to_owned(), data.to_owned());
      let mut service_alerts = config.get_service_alerts_handler(data.to_owned());

      let mut stops_map: BTreeMap<String, Stop> = BTreeMap::new();

      loop {
        if !ws.can_write() {
          break;
        }

        stops_map.clear();

        data.write().unwrap().refresh_realtime();

        for i in 0..subway.len() {
          subway.get_mut(i).unwrap().refresh();
          stops_map.insert(
            subway.get(i).unwrap().stop_ids.first().unwrap().to_owned(),
            subway.get(i).unwrap().serialize(),
          );
        }

        for i in 0..bus.len() {
          bus.get_mut(i).unwrap().refresh();
          stops_map.insert(
            bus.get(i).unwrap().stop_ids.first().unwrap().to_string(),
            bus.get(i).unwrap().serialize(),
          );
        }

        service_alerts.refresh();

        let mut routes_static = data.read().unwrap().subway_static_feed.routes.to_owned();

        for gtfs in &data.read().unwrap().bus_static_feed {
          for (key, value) in gtfs.routes.iter() {
            routes_static.insert(key.to_owned(), value.to_owned());
          }
        }

        let data = InfoJson {
          stops_realtime: stops_map.to_owned(),
          service_alerts_realtime: service_alerts.subway.to_owned(),
          routes_static: routes_static.to_owned(),
        };

        let data = serde_json::to_string(&data).unwrap();
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
