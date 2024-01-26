mod lines;

use transit_board::{StationHandler, lines::Lines};


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
    println!("Bedford Park Blvd (BD)");
    for (line, time) in bedford.times {
        println!("({}) - {} mins", line, time);
    }
}
