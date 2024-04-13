use std::sync::{Arc, RwLock};

use serde::{Deserialize, Serialize};

use crate::{bus_stop_handler::BusStopHandler, delay::ServiceAlertHandler, feed_data::FeedData, subway_stop_handler::SubwayStopHandler};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Conf {
    subway: Vec<StopConf>,
    bus: Vec<StopConf>,
    service_alerts: ServiceAlertsConf,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct StopConf {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ServiceAlertsConf {
    pub severity_limit: i32,
}

impl ServiceAlertsConf {
    pub fn new(severity_limit: i32) -> Self {
        Self {
            severity_limit,
        }
    }
}

impl Conf {
    pub fn new(
        subway: Vec<StopConf>,
        bus: Vec<StopConf>,
        service_alerts: ServiceAlertsConf,
    ) -> Self {
        Self {
            subway,
            bus,
            service_alerts,
        }
    }

    pub fn get_subway_handlers(&self, feed_data: Arc<RwLock<FeedData>>) -> Vec<SubwayStopHandler> {
        self.subway
            .iter()
            .map(|x| SubwayStopHandler::new(x.stop_ids.clone(), x.walk_time, feed_data.clone()))
            .collect()
    }

    pub fn get_bus_handlers(&self, api_key: Arc<String>) -> Vec<BusStopHandler> {
        self.bus
            .iter()
            .map(|x| BusStopHandler::new(api_key.clone(), x.stop_ids.clone(), 0))
            .collect()
    }

    pub fn get_service_alerts_handler(&self, feed_data: Arc<RwLock<FeedData>>) -> ServiceAlertHandler {
        ServiceAlertHandler::new(self.service_alerts.severity_limit, feed_data)
    }
}
