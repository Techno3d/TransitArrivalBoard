mod lines;
mod siri_structs;

use std::collections::HashMap;
use std::net::TcpListener;
use std::sync::{Arc, RwLock};
use std::thread::JoinHandle;
use std::time::Duration;
use std::{fs, thread};

use serde::{Deserialize, Serialize};
use transit_board::config::Conf;
use transit_board::{lines::Lines, mercury::MercuryDelays, BusStopHandler, StationHandler};
use transit_board::{StationJson, StopJson};
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
    let mut stations = config.get_station_handlers();
    let mut stops = config.get_stop_handlers(api_key_bus.clone());
    let mut delay_map: HashMap<Lines, (i32, String)> = HashMap::new();
    let lehman = StationHandler::new_no_name(Lines::_5, "405S".to_string(), 10);
    let bedford = StationHandler::new_no_name(Lines::D, "D03S".to_string(), 14);
    //let mut grand_central = StationHandler::new(api_key.to_string(), Lines::_6, "631S".to_string(), 5);
    let bx1028 = BusStopHandler::new(
        api_key_bus.to_owned(),
        vec!["100017".to_string(), "103400".to_string()],
        "Paul Av/W 205th Street".to_owned(),
    );
    let bx2526 = BusStopHandler::new(
        api_key_bus.to_owned(),
        vec!["100723".to_string()],
        "W 205th St/Paul Av".to_owned(),
    ); //, "803061".to_string() // Not needed?
    if stations.len() == 0 {
        stations = vec![lehman, bedford];
    }
    if stops.len() == 0 {
        stops = vec![bx2526, bx1028];
    }

    let send_data_clone = Arc::new(RwLock::new(InfoJson::default()));
    let send_data = send_data_clone.clone();
    let update_threads = Arc::new(RwLock::new(Vec::<JoinHandle<_>>::new()));
    let update = update_threads.clone();

    let update_thread = thread::spawn(move || {
        loop {
            for i in 0..stations.len() {
                stations.get_mut(i).unwrap().refresh();
            }

            for i in 0..stops.len() {
                stops.get_mut(i).unwrap().refresh();
            }

            delay_map.clear();
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
                        let line = Lines::to_line(decomposed.get(1).unwrap());
                        let severity = match (*decomposed.get(2).unwrap()).parse() {
                            Ok(x) => x,
                            Err(_) => 0,
                        };
                        if delay_map.contains_key(&line) {
                            if severity > delay_map.get(&line).unwrap().0 {
                                delay_map.get_mut(&line).unwrap().0 = severity;
                            }
                        } else {
                            delay_map.insert(
                                line,
                                (
                                    severity,
                                    match alert.description_text {
                                        Some(ref a) => {
                                            a.translation.get(0).unwrap().text.clone().unwrap()
                                        }
                                        None => "".to_owned(),
                                    },
                                ),
                            );
                        }
                    }
                }
            }
            let data = InfoJson {
                subway: stations.iter().map(|x| x.serialize()).collect(),
                stop: stops.iter().map(|x| x.serialize()).collect(),
                delay: delay_map.clone(),
            };
            {
                *send_data.write().unwrap() = data.clone();
                for handle in &*update.read().unwrap() {
                    handle.thread().unpark();
                }
            }
            thread::sleep(Duration::from_secs(60));
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
    subway: Vec<StationJson>,
    stop: Vec<StopJson>,
    delay: HashMap<Lines, (i32, String)>,
}
