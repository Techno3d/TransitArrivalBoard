mod siri_structs;

use std::collections::HashMap;
use std::net::TcpListener;
use std::sync::Arc;
use std::thread;
use std::time::Duration;

use serde::{Deserialize, Serialize};
use transit_board::config::{Conf, ServiceAlertsConf};
use transit_board::{bus_stop_handler::BusStopHandler, delay::Disruption, Stop, subway_stop_handler::SubwayStopHandler};
use tungstenite::Message;

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key_bus = Arc::new(std::env::var("MTABUSKEY").unwrap());

    let server = TcpListener::bind("0.0.0.0:9001").unwrap();

    for stream in server.incoming() {
        let api_key_bus = api_key_bus.clone();
        let handle = thread::spawn(move || {
            let mut ws = tungstenite::accept(stream.unwrap()).unwrap();


            let config: Conf = match ws.read() {
                Ok(c) => serde_json::from_str(c.to_text().unwrap().as_ref()).unwrap(),
                Err(_) => Conf::new(vec![], vec![], ServiceAlertsConf::new(12)),
            };

            let mut subway = config.get_subway_handlers();
            let mut bus = config.get_bus_handlers(api_key_bus.clone());
            let mut service_alerts = config.get_service_alerts_handler();

            let mut subway_map: HashMap<String, Stop> = HashMap::new();
            let mut bus_map: HashMap<String, Stop> = HashMap::new();
            let mut service_alerts_vec: Vec<Disruption> = Vec::new();

            let jerome = SubwayStopHandler::new(vec!["405S".to_string()], 10);
            let concourse = SubwayStopHandler::new(vec!["D03S".to_string()], 14);
            let bx1028 = BusStopHandler::new(
                api_key_bus.to_owned(),
                vec!["100017".to_string(), "103400".to_string()],
                3,
            );
            let bx222526 =
                BusStopHandler::new(api_key_bus.to_owned(), vec!["100723".to_string()], 3);

            if subway.len() == 0 {
                subway = vec![jerome, concourse];
            }
            if bus.len() == 0 {
                bus = vec![bx222526, bx1028];
            }

            loop {
                if !ws.can_write() {
                    break;
                }
                subway_map.clear();
                bus_map.clear();
                service_alerts_vec.clear();
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
                let service_alerts_vec = service_alerts.subway.to_owned();

                let data = InfoJson {
                    subway: subway_map.clone(),
                    bus: bus_map.clone(),
                    service_alerts: service_alerts_vec.clone(),
                };

                let data = serde_json::to_string(&data).unwrap();
                let message = Message::Text(data);

                match ws.send(message) {
                    Ok(_) => {}
                    Err(_) => break,
                };

                println!("finished");
                thread::sleep(Duration::from_secs(30));
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
}
