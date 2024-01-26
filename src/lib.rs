use std::time::{SystemTime, UNIX_EPOCH};

use lines::Lines;
use prost::Message;

pub mod lines;
pub mod gtfsrt {
    include!(concat!(env!("OUT_DIR"), "/transit_realtime.rs"));
}

pub struct StationHandler {
    pub line: Lines,
    pub station_code: String,
    pub times: Vec<(Lines, u64)>,
    api_key: String,
}

impl StationHandler {
    pub fn new(api_key: String, line: Lines, station_code: String) -> Self {
        Self { api_key, line, station_code, times: vec![], }
    }

    pub fn refresh(&mut self) {
        let uri = self.line.to_uri();
        let resp = minreq::get(uri).with_header("x-api-key", &self.api_key).send().unwrap();
        let bytes = resp.as_bytes();
        let feed = gtfsrt::FeedMessage::decode(bytes).unwrap();
        for entity in feed.entity {
            if let Some(tu) = entity.trip_update {
                for stop in tu.stop_time_update {
                    if stop.stop_id() == self.station_code {
                        let time = stop.arrival.unwrap().time();
                        let secs: u64 = if u64::try_from(time).unwrap() < SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() {
                            0
                        } else {
                            u64::try_from(time).unwrap() - SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() 
                        };
                        //Parsing trip id for train name as defined in https://api.mta.info/GTFS.pdf
                        let parsed_tid = tu.trip.trip_id().split("_").last().unwrap();
                        let parsed_route = parsed_tid.split("..").next().unwrap();
                        let route = Lines::to_line(parsed_route);
                        self.times.push((route, secs/60));
                    }
                }
            }
        }
    }
}
