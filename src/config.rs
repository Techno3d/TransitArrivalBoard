use serde::{Deserialize, Serialize};

use crate::{lines::Lines, BusStopHandler, StationHandler};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Conf {
    stations: Vec<StationConf>,
    stops: Vec<StopConf>,
}


#[derive(Debug, Serialize, Deserialize, Default)]
struct StationConf {
    name: String,
    station_code: String,
    walk_time: i32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct StopConf {
    pub name: String,
    pub stop_ids: Vec<String>,
}

impl Conf {
    pub fn get_station_handlers(&self) -> Vec<StationHandler> {
        self.stations.iter().map(|x| {
            StationHandler::new(Lines::to_line(&x.station_code.chars().next().unwrap().to_string()), x.station_code.clone(), x.walk_time, x.name.clone())
        }).collect()
    }

    pub fn get_stop_handlers(&self, api_key: String) -> Vec<BusStopHandler> {
        self.stops.iter().map(|x| {
            BusStopHandler::new(api_key.clone(), x.stop_ids.clone(), x.name.clone())
        }).collect()
    }
}
