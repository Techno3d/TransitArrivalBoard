mod lines;
mod siri_structs;

use std::{rc::Rc, sync::mpsc::{Receiver, Sender}, time::Duration};
use std::sync::mpsc;

use slint::{ComponentHandle, VecModel};
use transit_board::{lines::Lines, mercury::MercuryDelays, ArrivalBoard, BusStopHandler, BusStopInfo, StationHandler, StationInfo};

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key = std::env::var("NYCTKEY").unwrap();
    let api_key_bus = std::env::var("MTABUSKEY").unwrap();
    let mut lehman = StationHandler::new(api_key.to_string(), Lines::_4, "405S".to_string(), 10);
    let mut bedford = StationHandler::new(api_key.to_string(), Lines::D, "D03S".to_string(), 14);
    //let mut grand_central = StationHandler::new(api_key.to_string(), Lines::_6, "631S".to_string(), 5);
    let mut bx1028 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100017".to_string(), "103400".to_string()]);
    let mut bx2526 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100723".to_string()]); //, "803061".to_string() // Not needed?
    lehman.refresh();
    bedford.refresh();

    let board = ArrivalBoard::new().unwrap();
    let board_weak = board.as_weak();
    let (send, recv): (Sender<bool>, Receiver<bool>) = mpsc::channel();
    let handle = std::thread::spawn(move || {
        loop {
            lehman.refresh();
            bedford.refresh();
            bx1028.refresh();
            bx2526.refresh();
            //grand_central.refresh();
            
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
            let mut lehman_delays: Vec<i32> = vec![];
            let mut bedford_delays: Vec<i32> = vec![];
            for entity in delays.entity {
                for informed in entity.alert.unwrap().informed_entity.unwrap() {
                    if let Some(selector) = informed.transit_realtime_mercury_entity_selector {
                        let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                        if decomposed.get(1).unwrap() == &"4" {
                            lehman_delays.push(match (*decomposed.get(2).unwrap()).parse() {
                                Ok(x) => x,
                                Err(_) => 0,
                            });
                        }
                        if decomposed.get(1).unwrap() == &"B" || decomposed.get(1).unwrap() == &"D"  {
                            bedford_delays.push(match (*decomposed.get(2).unwrap()).parse() {
                                Ok(x) => x,
                                Err(_) => 0,
                            });
                        }
                    }
                }
            }
            lehman_delays.sort();
            bedford_delays.sort();
            lehman.delay = *(lehman_delays.last().unwrap_or(&0));
            bedford.delay = *(bedford_delays.last().unwrap_or(&0));

            let inp = vec![lehman.clone(),bedford.clone()];
            let businp = vec![bx1028.clone(), bx2526.clone()];
            //inp.sort(); // Confusing
            let board_copy = board_weak.clone();



            slint::invoke_from_event_loop(move || {
                let inp: Vec<StationInfo> = inp.into_iter().map(|x| x.serialize()).collect();
                let inp = Rc::new(VecModel::from(inp)).into();
                board_copy.unwrap().set_inp(inp);
                //Busses
                let businp: Vec<BusStopInfo> = businp.into_iter().map(|x| x.serialize()).collect();
                let businp = Rc::new(VecModel::from(businp));
                board_copy.unwrap().set_businp(businp.into());
            }).unwrap();
            match recv.recv_timeout(Duration::from_secs(60)) {
                Ok(r) => {
                    if r { return; }
                },
                Err(_) => {},
            };
        }
    });
    board.window().set_fullscreen(true);
    board.run().unwrap();
    let _ = send.send(true);
    handle.join().unwrap();
    //board.set_inp(Rc::new(VecModel::from(inp)).into());
}
