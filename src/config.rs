use serde::{Deserialize, Serialize};

use crate::{BusStopHandler, SubwayStopHandler};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Conf {
    subway: Vec<SubwayConf>,
    bus: Vec<BusConf>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct SubwayConf {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub use_array_format: bool,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct BusConf {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub use_array_format: bool,
}

impl Conf {
    pub fn get_subway_handlers(&self) -> Vec<SubwayStopHandler> {
        self.subway
            .iter()
            .map(|x| SubwayStopHandler::new(x.stop_ids.clone(), x.walk_time, x.use_array_format))
            .collect()
    }

    pub fn get_bus_handlers(&self, api_key: String) -> Vec<BusStopHandler> {
        self.bus
            .iter()
            .map(|x| {
                BusStopHandler::new(api_key.clone(), x.stop_ids.clone(), 0, x.use_array_format)
            })
            .collect()
    }
}
