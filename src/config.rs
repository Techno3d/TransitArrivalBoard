use serde::{Deserialize, Serialize};

use crate::{BusStopHandler, SubwayStopHandler};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Conf {
    subway: Vec<SubwayConf>,
    bus: Vec<BusConf>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct SubwayConf {
    name: String,
    stop_id: String,
    walk_time: i32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct BusConf {
    pub name: String,
    pub stop_ids: Vec<String>,
}

impl Conf {
    pub fn get_subway_handlers(&self) -> Vec<SubwayStopHandler> {
        self.subway
            .iter()
            .map(|x| SubwayStopHandler::new(x.stop_id.clone(), x.walk_time))
            .collect()
    }

    pub fn get_bus_handlers(&self, api_key: String) -> Vec<BusStopHandler> {
        self.bus
            .iter()
            .map(|x| BusStopHandler::new(api_key.clone(), x.stop_ids.clone(), 0))
            .collect()
    }
}
