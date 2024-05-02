use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

pub mod bus_stop_handler;
pub mod config;
pub mod feed_handler;
pub mod mercury_structs;
pub mod service_alert_handler;
pub mod siri_structs;
pub mod subway_stop_handler;
pub mod gtfsrt {
  include!(concat!(env!("OUT_DIR"), "/transit_realtime.rs"));
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vehicle {
  pub route_id: String,
  pub route_name: String,
  pub destination_id: String,
  pub destination_name: String,
  pub minutes_until_arrival: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stop {
  pub stop_name: String,
  pub walk_time: i32,
  pub trips: Vec<Vehicle>,
  pub routes: BTreeMap<String, BTreeMap<String, Vec<Vehicle>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Alert {
  pub route_id: String,
  pub sort_order: i32,
  pub header_text: String,
}
