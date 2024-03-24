mod lines;
mod siri_structs;


use std::net::TcpListener;
use std::time::Duration;
use std::collections::HashMap;
use std::thread;

use crossbeam_channel::{unbounded, Receiver, Sender};
use serde::{Deserialize, Serialize};
use transit_board::{StationJson, StopJson};
use transit_board::{lines::Lines, mercury::MercuryDelays, BusStopHandler, StationHandler};
use tungstenite::Message;

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key = std::env::var("NYCTKEY").unwrap();
    let api_key_bus = std::env::var("MTABUSKEY").unwrap();
    let mut delay_map: HashMap<Lines, i32> = HashMap::new();
    let mut lehman = StationHandler::new(api_key.to_string(), Lines::_4, "405S".to_string(), 10);
    let mut bedford = StationHandler::new(api_key.to_string(), Lines::D, "D03S".to_string(), 14);
    //let mut grand_central = StationHandler::new(api_key.to_string(), Lines::_6, "631S".to_string(), 5);
    let mut _bx1028 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100017".to_string(), "103400".to_string()]);
    let mut _bx2526 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100723".to_string()]); //, "803061".to_string() // Not needed?

    let (send, recv): (Sender<InfoJson>, Receiver<InfoJson>) = unbounded();

    let update_thread = thread::spawn(move || {
        loop {
            lehman.refresh();
            bedford.refresh();

            delay_map.clear();
            // Delays
            let resp2 = minreq::get("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json")
                .with_header("x-api-key", &api_key)
                .send()
                .unwrap();
            let bytes = resp2.as_bytes();
            let delays: MercuryDelays = match serde_json::from_slice(bytes) {
                Ok(r) => r,
                Err(_) => Default::default(),
            };
            for entity in delays.entity {
                for informed in entity.alert.unwrap().informed_entity.unwrap() {
                    if let Some(selector) = informed.transit_realtime_mercury_entity_selector {
                        let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                        let line = Lines::to_line(decomposed.get(1).unwrap());
                        let severity = match (*decomposed.get(2).unwrap()).parse() {
                            Ok(x) => x,
                            Err(_) => 0,
                        };
                        if delay_map.contains_key(&line) {
                            if &severity > delay_map.get(&line).unwrap() {
                                *delay_map.get_mut(&line).unwrap() = severity;
                            }
                        } else {
                            delay_map.insert(line, severity);
                        }
                    }
                }
            }
            let data = InfoJson {
                subway: vec![lehman.serialize(), bedford.serialize()],
                stop: vec![_bx2526.serialize(), _bx1028.serialize()],
                delay: delay_map.clone(),
            };
            match send.send(data) {
                Ok(_) => {},
                Err(_) => {},
            };
            thread::sleep(Duration::from_secs(60));
        }
    });

    // Web Sockets
    let server = TcpListener::bind("0.0.0.0:9001").unwrap();
    for stream in server.incoming() {
        let recv_copy = recv.clone();
        thread::spawn(move || {
            let mut ws = tungstenite::accept(stream.unwrap()).unwrap();
            loop {
                let data = recv_copy.recv().unwrap();
                let data = serde_json::to_string(&data).unwrap();
                let message = Message::Text(data);
                match ws.send(message) {
                    Ok(_) => {},
                    Err(_) => break,
                };
            }
        });
    }
    update_thread.join().unwrap();
}


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct InfoJson {
    subway: Vec<StationJson>,
    stop: Vec<StopJson>,
    delay: HashMap<Lines, i32>,
}
