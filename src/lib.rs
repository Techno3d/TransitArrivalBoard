use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub mod bus_stop_handler;
pub mod config;
pub mod delay;
pub mod feed_data;
pub mod lines;
pub mod mercury;
pub mod siri_structs;
pub mod subway_stop_handler;
pub mod gtfsrt {
    include!(concat!(env!("OUT_DIR"), "/transit_realtime.rs"));
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vehicle {
    pub route: String,
    pub destination: String,
    pub minutes_until_arrival: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stop {
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
    pub walk_time: i32,
}
