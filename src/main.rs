mod siri_structs;

use std::collections::HashMap;
use std::net::TcpListener;
use std::sync::{Arc, RwLock};
use std::thread;
use std::time::Duration;

use gtfs_structures::Route;
use serde::{Deserialize, Serialize};
use transit_board::config::Config;
use transit_board::feed_handler::FeedHandler;
use transit_board::{Disruption, Stop};
use tungstenite::protocol::frame::coding::CloseCode;
use tungstenite::protocol::CloseFrame;
use tungstenite::Message;

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key_bus = Arc::new(std::env::var("MTABUSKEY").unwrap());

    let server = TcpListener::bind("0.0.0.0:9001").unwrap();

    for stream in server.incoming() {
        let api_key_bus = api_key_bus.to_owned();
        let handle = thread::spawn(move || {
            let mut ws = tungstenite::accept(stream.unwrap()).unwrap();

            let config: Result<Config, serde_json::Error> = match ws.read() {
                Ok(c) => serde_json::from_str(c.to_text().unwrap().as_ref()),
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
            data.write().unwrap().refresh_static_gtfs();

            let mut subway = config.get_subway_handlers(data.to_owned());
            let mut bus = config.get_bus_handlers(api_key_bus.to_owned());
            let mut service_alerts = config.get_service_alerts_handler(data.to_owned());

            loop {
                if !ws.can_write() {
                    break;
                }

                let mut subway_map: HashMap<String, Stop> = HashMap::new();
                let mut bus_map: HashMap<String, Stop> = HashMap::new();

                data.write().unwrap().refresh_feeds();

                for i in 0..subway.len() {
                    subway.get_mut(i).unwrap().refresh();
                    subway_map.insert(
                        subway
                            .get(i)
                            .unwrap()
                            .stop_ids
                            .iter()
                            .next()
                            .unwrap()
                            .to_owned(),
                        subway.get(i).unwrap().serialize(),
                    );
                }

                for i in 0..bus.len() {
                    bus.get_mut(i).unwrap().refresh();
                    bus_map.insert(
                        bus.get(i)
                            .unwrap()
                            .stop_ids
                            .iter()
                            .next()
                            .unwrap()
                            .to_string(),
                        bus.get(i).unwrap().serialize(),
                    );
                }

                service_alerts.refresh();

                let data = InfoJson {
                    subway: subway_map.to_owned(),
                    bus: bus_map.to_owned(),
                    service_alerts: service_alerts.subway.to_owned(),
                    routes: data.read().unwrap().gtfs_static_feed.routes.to_owned(),
                };

                let data = serde_json::to_string(&data).unwrap();
                let message = Message::Text(data);

                match ws.send(message) {
                    Ok(_) => {}
                    Err(_) => break,
                };

                thread::sleep(Duration::from_secs(5));
            }
        });

        handle.join().unwrap();
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct InfoJson {
    subway: HashMap<String, Stop>,
    bus: HashMap<String, Stop>,
    service_alerts: Vec<Disruption>,
    routes: HashMap<String, Route>,
}
