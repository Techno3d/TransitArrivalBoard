use std::time::{SystemTime, UNIX_EPOCH};
use std::{collections::HashMap, ops::Sub};

use lines::Lines;
use prost::Message;
use serde::{Deserialize, Serialize};
use siri_structs::BusData;
use time::{self, Date, OffsetDateTime, Time, UtcOffset};

pub mod config;
pub mod lines;
pub mod mercury;
pub mod siri_structs;
pub mod gtfsrt {
    include!(concat!(env!("OUT_DIR"), "/transit_realtime.rs"));
}

#[derive(Debug, Clone)]
pub struct StationHandler {
    pub name: String,
    pub line: Lines,
    pub station_code: String,
    pub times: Vec<(Lines, String, u64)>,
    pub walk_time: i32,
    pub delay: i32,
    //api_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StationJson {
    pub name: String,
    pub times: HashMap<Lines, HashMap<String, Vec<i32>>>,
    pub walk_time: i32,
}

impl StationHandler {
    pub fn new_no_name(line: Lines, station_code: String, walk_time: i32) -> Self {
        Self {
            name: station_code_to_name(&station_code),
            line,
            station_code,
            times: vec![],
            walk_time,
            delay: 0,
        }
    }

    pub fn new(line: Lines, station_code: String, walk_time: i32, name: String) -> Self {
        Self {
            name,
            line,
            station_code,
            times: vec![],
            walk_time,
            delay: 0,
        }
    }

    pub fn refresh(&mut self) {
        self.times.clear();
        let uri = self.line.to_uri();
        let resp = minreq::get(uri).send().unwrap();
        let bytes = resp.as_bytes();
        let feed = match gtfsrt::FeedMessage::decode(bytes) {
            // if no data so abort
            Ok(a) => a,
            Err(_) => return,
        };
        for entity in feed.entity {
            if let Some(tu) = entity.trip_update {
                for stop in tu.stop_time_update.iter() {
                    if stop.stop_id() == self.station_code {
                        let time = (match &stop.arrival {
                            Some(a) => a,
                            None => continue,
                        })
                        .time();
                        let secs: u64 = if u64::try_from(time).unwrap()
                            < SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_secs()
                        {
                            // Does this break once the year gets too high?
                            0
                        } else {
                            u64::try_from(time).unwrap()
                                - SystemTime::now()
                                    .duration_since(UNIX_EPOCH)
                                    .unwrap()
                                    .as_secs()
                        };
                        // Parsing trip id for train name as defined in https://api.mta.info/GTFS.pdf
                        // Shouldn't break unless trip id is changed
                        let parsed_tid = tu.trip.trip_id().split("_").last().unwrap();
                        let mut tid_split = parsed_tid.split("..");
                        let parsed_route = tid_split.next().unwrap();
                        let route = Lines::to_line(parsed_route);
                        let terminus = match tu.stop_time_update.last() {
                            Some(a) => a.stop_id().to_owned(),
                            None => "".to_owned(),
                        };
                        self.times.push((route, terminus, secs / 60));
                    }
                }
            }
        }
        self.times.truncate(5);
    }

    pub fn serialize(&self) -> StationJson {
        StationJson {
            name: station_code_to_name(&self.station_code),
            times: self.get_time_map(),
            walk_time: self.walk_time,
        }
    }

    fn get_time_map(&self) -> HashMap<Lines, HashMap<String, Vec<i32>>> {
        let mut map: HashMap<Lines, HashMap<String, Vec<i32>>> = HashMap::new();
        for (line, terminus, time) in self.times.clone() {
            if map.contains_key(&line) {
                if map.get_mut(&line).unwrap().contains_key(&terminus) {
                    map.get_mut(&line)
                        .unwrap()
                        .get_mut(&terminus)
                        .unwrap()
                        .push(time.try_into().unwrap());
                } else {
                    map.get_mut(&line)
                        .unwrap()
                        .insert(terminus, vec![time.try_into().unwrap()]);
                }
            } else {
                map.insert(
                    line,
                    HashMap::from([(terminus, vec![time.try_into().unwrap()])]),
                );
            }
        }
        map
    }
}

fn station_code_to_name(code: &String) -> String {
    // The double deref
    match &**code {
        "405S" | "405N" | "405" => "Bedford Park Blvd - Lehman College (4)".to_owned(),
        "D03S" | "D03N" | "D03" => "Bedford Park Blvd (BD)".to_owned(),
        "631S" => "Grand Central - 42ST".to_owned(),
        _ => "Err".to_owned(),
    }
}

#[derive(Debug, Clone)]
pub struct BusStopHandler {
    api_key: String,
    pub name: String,
    pub times: HashMap<String, HashMap<String, Vec<i32>>>,
    pub stop_id: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StopJson {
    pub name: String,
    pub times: HashMap<String, HashMap<String, Vec<i32>>>,
}

impl BusStopHandler {
    pub fn new(api_key: String, stop_id: Vec<String>, name: String) -> Self {
        Self {
            api_key,
            stop_id,
            name,
            times: HashMap::new(),
        }
    }

    // Support for stops that are broken into dir 1 and dir 2
    pub fn refresh(&mut self) {
        self.times.clear();
        let ids = self.stop_id.clone();
        let time_now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .try_into()
            .unwrap();
        let now = OffsetDateTime::from_unix_timestamp(time_now).unwrap();
        for id in ids.iter() {
            self.refresh_single(id, now);
        }
    }

    fn refresh_single(&mut self, stopid: &String, now: OffsetDateTime) {
        let resp = match minreq::get("https://bustime.mta.info/api/siri/stop-monitoring.json")
            .with_param("key", &self.api_key)
            .with_param("version", "2")
            .with_param("OperatorRef", "MTA")
            .with_param("MonitoringRef", stopid)
            .send()
        {
            Ok(a) => a,
            Err(_) => return, // No data
        };
        let data: BusData = serde_json::from_slice(resp.as_bytes()).unwrap();
        let temp = match data.siri.service_delivery {
            Some(a) => a,
            None => return,
        };
        for stop_data in temp.stop_monitoring_delivery {
            let monitored_visit = match stop_data.monitored_stop_visit {
                Some(a) => a,
                None => return,
            };
            for visit in monitored_visit {
                //let route_name = visit.monitored_vehicle_journey.line_ref.split("_").last().unwrap();
                let route_name = visit
                    .monitored_vehicle_journey
                    .published_line_name
                    .get(0)
                    .unwrap();
                let dest = visit
                    .monitored_vehicle_journey
                    .destination_name
                    .get(0)
                    .unwrap()
                    .trim();
                let dest = match dest {
                    "CO-OP CITY EARHART LANE via GUNHILL" => "CO-OP CITY",
                    "FORDHAM CENTER 192 ST via GUNHILL" => "FORDHAM CENTER",
                    "CO-OP CITY EARHART LANE via ALLERTON AV" => "CO-OP CITY",
                    "CO-OP CITY BAY PLAZA via ALLERTON AV" => "CO-OP CITY BAY PLAZA",
                    a => a,
                };
                let time = visit
                    .monitored_vehicle_journey
                    .monitored_call
                    .expected_arrival_time
                    .unwrap_or(
                        visit
                            .monitored_vehicle_journey
                            .monitored_call
                            .expected_departure_time
                            .unwrap_or("Now".to_owned()),
                    ); // If it isn't given, bus is at stop waiting to leave
                let mut min_away = 0;
                // Let the cursed code begin
                // Unwraps should be fine if the MTA doesn't change the time format they are using
                if time != "Now".to_owned() {
                    let mut thing = time.split(".");
                    let mut time = thing.next().unwrap().split("T");
                    // It is a limitation to hardcode this, but MTA is in eastern time so it will
                    // be either 5 (est) or 4 (edt)
                    let offset = if thing
                        .next()
                        .unwrap()
                        .split("-")
                        .last()
                        .unwrap()
                        .contains("5")
                    {
                        5
                    } else {
                        4
                    };
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
                        day.get(2).unwrap().parse().unwrap(),
                    )
                    .unwrap();
                    // I am sorry for this crime of a line
                    let time = Time::from_hms(
                        secs.next().unwrap().parse().unwrap(),
                        secs.next().unwrap().parse().unwrap(),
                        secs.next().unwrap().parse().unwrap(),
                    )
                    .unwrap();
                    let mut datetime = OffsetDateTime::new_in_offset(date, time, UtcOffset::UTC);
                    datetime = datetime.saturating_add(time::Duration::hours(offset));
                    min_away = datetime.sub(now).whole_minutes();
                }
                // This feels like an abomination, probably because it is
                if !self.times.contains_key(route_name) {
                    let mut map = HashMap::new();
                    map.insert(dest.to_owned(), vec![min_away.try_into().unwrap()]);
                    self.times.insert(route_name.to_owned(), map);
                } else {
                    if self.times.get(route_name).unwrap().contains_key(dest) {
                        self.times
                            .get_mut(route_name)
                            .unwrap()
                            .get_mut(dest)
                            .unwrap()
                            .push(min_away.try_into().unwrap());
                    } else {
                        self.times
                            .get_mut(route_name)
                            .unwrap()
                            .insert(dest.to_owned(), vec![min_away.try_into().unwrap()]);
                    }
                }
            }
        }
    }

    pub fn serialize(&self) -> StopJson {
        StopJson {
            name: self.name.clone(),
            times: self.times.clone(),
        }
    }
}
