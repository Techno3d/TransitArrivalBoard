mod lines;
mod siri_structs;

use transit_board::{lines::Lines, BusStopHandler, StationHandler};

fn main() {
    dotenvy::dotenv().unwrap();
    let api_key = std::env::var("NYCTKEY").unwrap();
    let mut lehman = StationHandler::new(api_key.to_string(), Lines::_4, "405S".to_string());
    let mut bedford = StationHandler::new(api_key.to_string(), Lines::D, "D03S".to_string());
    lehman.refresh();
    bedford.refresh();
    println!("Bedford Park Blvd - Lehman College (4)");
    for (line, time) in lehman.times {
        println!("({}) - {} mins", line, time);
    }
    println!("\nBedford Park Blvd (BD)");
    for (line, time) in bedford.times {
        println!("({}) - {} mins", line, time);
    }
     
    let api_key_bus = std::env::var("MTABUSKEY").unwrap();
    //println!("{}", thing.line_ref);
    let mut bus_handler = BusStopHandler::new(api_key_bus, "100017".to_string());
    bus_handler.refresh();
    println!("\nStops at Paul Av - W 205th St");
    for (line, time) in bus_handler.times {
        println!("{} - {} mins", line, time);
    }
}
