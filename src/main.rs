mod siri_structs;

use std::cmp::Ordering;
use std::collections::HashMap;
use std::net::TcpListener;
use std::sync::{Arc, RwLock};
use std::thread::JoinHandle;
use std::time::Duration;
use std::{fs, thread};

use gtfs_structures::Gtfs;
use serde::{Deserialize, Serialize};
use transit_board::config::Conf;
use transit_board::mercury::MercuryDelays;
use transit_board::{BusStopHandler, BusStopJson, Disruption, SubwayStopHandler, SubwayStopJson};
use tungstenite::Message;

fn main() {
    dotenvy::dotenv().unwrap();
    //let api_key = std::env::var("NYCTKEY").unwrap();
    let api_key_bus = std::env::var("MTABUSKEY").unwrap();
    let config = match fs::read_to_string("config.json") {
        Ok(a) => a,
        Err(_) => "none".to_owned(),
    };
    let config: Conf = match serde_json::from_str(&config) {
        Ok(a) => a,
        Err(_) => Default::default(),
    };
    let mut subway = config.get_subway_handlers();
    let mut bus = config.get_bus_handlers(api_key_bus.clone());

    let mut subway_map: HashMap<String, SubwayStopJson> = HashMap::new();
    let mut bus_map: HashMap<String, BusStopJson> = HashMap::new();
    let mut service_alerts_map: Vec<Disruption> = vec![];

    let jerome = SubwayStopHandler::new(vec!["405S".to_string()], 10, true);
    let concourse = SubwayStopHandler::new(vec!["D03S".to_string()], 14, true);
    let bx1028 = BusStopHandler::new(
        api_key_bus.to_owned(),
        vec!["100017".to_string(), "103400".to_string()],
        3,
        false,
    );
    let bx222526 =
        BusStopHandler::new(api_key_bus.to_owned(), vec!["100723".to_string()], 3, false);
    if subway.len() == 0 {
        subway = vec![jerome, concourse];
    }
    if bus.len() == 0 {
        bus = vec![bx222526, bx1028];
    }

    let send_data_clone = Arc::new(RwLock::new(InfoJson::default()));
    let send_data = send_data_clone.clone();
    let update_threads = Arc::new(RwLock::new(Vec::<JoinHandle<_>>::new()));
    let update = update_threads.clone();

    let gtfs = match Gtfs::from_url(
        "http://web.mta.info/developers/data/nyct/subway/google_transit.zip",
    ) {
        Ok(a) => a,
        Err(_) => return,
    };

    let update_thread = thread::spawn(move || {
        loop {
            subway_map.clear();
            bus_map.clear();
            service_alerts_map.clear();

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

            // Delays
            let resp2 = minreq::get("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json")
                .send()
                .unwrap();
            let bytes = resp2.as_bytes();
            let delays: MercuryDelays = match serde_json::from_slice(bytes) {
                Ok(r) => r,
                Err(_) => Default::default(),
            };
            for entity in delays.entity {
                let alert = entity.alert.unwrap();
                for informed in alert.informed_entity.unwrap().iter() {
                    if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
                        let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                        let line = informed.route_id.as_ref().unwrap();
                        let gtfs_route = match gtfs.get_route(&line) {
                            Ok(a) => a.short_name.as_ref().unwrap(),
                            Err(_) => return,
                        };
                        let severity = match (*decomposed.get(2).unwrap()).parse() {
                            Ok(x) => x,
                            Err(_) => 0,
                        };

                        service_alerts_map.push(Disruption {
                            route: gtfs_route.to_string(),
                            priority: severity,
                            header: match alert.header_text {
                                Some(ref a) => a
                                    .translation
                                    .as_ref()
                                    .unwrap()
                                    .get(0)
                                    .unwrap()
                                    .text
                                    .as_ref()
                                    .unwrap()
                                    .clone(),
                                None => "".to_owned(),
                            },
                        });
                    }
                    service_alerts_map.sort_by(|x, y| {
                        if x.priority > y.priority {
                            return Ordering::Greater;
                        } else if x.priority < y.priority {
                            return Ordering::Less;
                        }
                        return Ordering::Equal;
                    });
                }
            }

            let data = InfoJson {
                subway: subway_map.clone(),
                bus: bus_map.clone(),
                service_alerts: service_alerts_map.clone(),
            };
            {
                *send_data.write().unwrap() = data.clone();
                for handle in &*update.read().unwrap() {
                    handle.thread().unpark();
                }
            }
            thread::sleep(Duration::from_secs(10));
        }
    });

    // Web Sockets
    let server = TcpListener::bind("0.0.0.0:9001").unwrap();
    for stream in server.incoming() {
        let data_clone = send_data_clone.clone();
        let handle = thread::spawn(move || {
            let mut ws = tungstenite::accept(stream.unwrap()).unwrap();
            loop {
                {
                    let data = data_clone.read().unwrap();
                    let data = serde_json::to_string(&*data).unwrap();
                    let message = Message::Text(data);
                    match ws.send(message) {
                        Ok(_) => {}
                        Err(_) => break,
                    };
                }
                thread::park();
            }
        });
        update_threads.write().unwrap().push(handle);
    }
    update_thread.join().unwrap();
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct InfoJson {
    subway: HashMap<String, SubwayStopJson>,
    bus: HashMap<String, BusStopJson>,
    service_alerts: Vec<Disruption>,
}
