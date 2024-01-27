use std::{ops::Sub, time::{SystemTime, UNIX_EPOCH}};

use lines::Lines;
use prost::Message;
use serde::Deserialize;
use siri_structs::BusData;
use time::{self, Date, OffsetDateTime, Time};

pub mod lines;
pub mod siri_structs;
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

pub struct BusStopHandler {
    api_key: String,
    pub times: Vec<(String, i64)>,
    pub stop_id: String,
}

impl BusStopHandler {
    pub fn new(api_key: String, stop_id: String) -> Self {
        Self {api_key, stop_id, times: vec![]}
    }

    pub fn refresh(&mut self) {
        let resp = minreq::get("https://bustime.mta.info/api/siri/stop-monitoring.json")
            .with_param("key", &self.api_key)
            .with_param("version", "2")
            .with_param("OperatorRef", "MTA")
            .with_param("MonitoringRef", &self.stop_id)
            .send()
            .unwrap();
        let data: BusData = serde_json::from_slice(resp.as_bytes()).unwrap();
        for stop_data in data.siri.service_delivery.stop_monitoring_delivery {
            for visit in stop_data.monitored_stop_visit {
                //let route_name = visit.monitored_vehicle_journey.line_ref.split("_").last().unwrap();
                let route_name = visit.monitored_vehicle_journey.published_line_name.get(0).unwrap();
                let time = visit.monitored_vehicle_journey.monitored_call.expected_arrival_time;
                let mut time = time.split(".").next().unwrap().split("T");
                let day: Vec<&str> = time.next().unwrap().split("-").collect();
                let mut secs = time.next().unwrap().split(":");
                let parse = day.get(1).unwrap().parse::<i32>();
                let date = Date::from_calendar_date(
                    day.get(0).unwrap().parse().unwrap(),
                    match parse.unwrap() {
                        1 => time::Month::January,
                        2 => time::Month::February,
                        3 => time::Month::March,
                        4 => time::Month::April,
                        5 => time::Month::May,
                        6 => time::Month::June,
                        7 => time::Month::July,
                        8 => time::Month::August,
                        9 => time::Month::September,
                        10 => time::Month::October,
                        11 => time::Month::November,
                        12 => time::Month::December,
                        _ => time::Month::January,
                    },
                    day.get(2).unwrap().parse().unwrap()
                ).unwrap();
                let time = Time::from_hms(secs.next().unwrap().parse().unwrap(), secs.next().unwrap().parse().unwrap(), secs.next().unwrap().parse().unwrap()).unwrap();
                let now = OffsetDateTime::now_local().unwrap();
                let datetime = OffsetDateTime::new_in_offset(date, time, now.offset());
                let min_away = datetime.sub(now).whole_minutes();
                self.times.push((route_name.to_string(), min_away));
            }
        }
    }
}
