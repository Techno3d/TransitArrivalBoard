use std::sync::{Arc, RwLock};

use serde::{Deserialize, Serialize};

use crate::{
  bus_stop_handler::BusStopHandler, feed_handler::FeedHandler, service_alert_handler::ServiceAlertHandler,
  subway_stop_handler::SubwayStopHandler,
};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Config {
  subway: Vec<StopConfig>,
  bus: Vec<StopConfig>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct StopConfig {
  pub stop_ids: Vec<String>,
  pub walk_time: i32,
}

impl Config {
  pub fn new(subway: Vec<StopConfig>, bus: Vec<StopConfig>) -> Self {
    Self { subway, bus }
  }

  pub fn get_subway_handlers(&self, feed_data: Arc<RwLock<FeedHandler>>) -> Vec<SubwayStopHandler> {
    self
      .subway
      .iter()
      .map(|a| SubwayStopHandler::new(a.stop_ids.to_owned(), a.walk_time, feed_data.to_owned()))
      .collect()
  }

  pub fn get_bus_handlers(&self, api_key: Arc<String>) -> Vec<BusStopHandler> {
    self
      .bus
      .iter()
      .map(|a| BusStopHandler::new(a.stop_ids.to_owned(), a.walk_time, api_key.to_owned()))
      .collect()
  }

  pub fn get_service_alerts_handler(&self, feed_data: Arc<RwLock<FeedHandler>>) -> ServiceAlertHandler {
    ServiceAlertHandler::new(feed_data)
  }
}
