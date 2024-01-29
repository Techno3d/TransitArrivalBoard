mod lines;
mod siri_structs;

use std::{rc::Rc, thread::sleep, time::Duration};

use slint::{ComponentHandle, VecModel};
use transit_board::{lines::Lines, ArrivalBoard, BusStopHandler, BusStopInfo, StationHandler, StationInfo};

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key = std::env::var("NYCTKEY").unwrap();
    let api_key_bus = std::env::var("MTABUSKEY").unwrap();
    let mut lehman = StationHandler::new(api_key.to_string(), Lines::_4, "405S".to_string(), 5);
    let mut bedford = StationHandler::new(api_key.to_string(), Lines::D, "D03S".to_string(), 5);
    //let mut grand_central = StationHandler::new(api_key.to_string(), Lines::_6, "631S".to_string(), 5);
    let mut bx1028 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100017".to_string()]);
    let mut bx2526 = BusStopHandler::new(api_key_bus.to_owned(), vec!["100723".to_string(), "803061".to_string()]);
    lehman.refresh();
    bedford.refresh();
    //grand_central.refresh();
    //bx1028.refresh();
    //bx2526.refresh();
    
    /*
    println!("Bedford Park Blvd - Lehman College (4)");
    for (line, time) in lehman.times.iter() {
        println!("({}) - {} mins", line, time);
    }
    println!("\nBedford Park Blvd (BD)");
    for (line, time) in bedford.times.iter() {
        println!("({}) - {} mins", line, time);
    }
     
    println!("{}", thing.line_ref);
    println!("\nStops at Paul Av - W 205th St");
    for (line, time) in bus_handler.times {
        println!("{} - {} mins", line, time);
    }

    println!("\nGrand Central - 42ST");
    for (line, time) in grand_central.times.iter() {
        //println!("{} - {} mins", line, time);
    }
    */

    let board = ArrivalBoard::new().unwrap();
    let board_weak = board.as_weak();
    let mut _quit = false;
    let handle = std::thread::spawn(move || {
        loop {
            if _quit { return ; }
            lehman.refresh();
            bedford.refresh();
            bx1028.refresh();
            bx2526.refresh();
            //grand_central.refresh();
            let mut inp = vec![lehman.clone(),bedford.clone()];
            let businp = vec![bx1028.clone(), bx2526.clone()];
            inp.sort();
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
            sleep(Duration::from_secs(60));
        }
    });
    board.run().unwrap();
    _quit = true;
    handle.join().unwrap();
    //board.set_inp(Rc::new(VecModel::from(inp)).into());
}
