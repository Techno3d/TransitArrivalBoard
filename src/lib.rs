use std::{cmp::Ordering, collections::HashMap, ops::Sub, rc::Rc, time::{SystemTime, UNIX_EPOCH}};

use lines::Lines;
use prost::Message;
use siri_structs::BusData;
use slint::{Color, VecModel};
use time::{self, Date, OffsetDateTime, Time, UtcOffset};

slint::include_modules!();

pub mod lines;
pub mod siri_structs;
pub mod gtfsrt {
    include!(concat!(env!("OUT_DIR"), "/transit_realtime.rs"));
}

#[derive(Debug, Clone)]
pub struct StationHandler {
    pub line: Lines,
    pub station_code: String,
    pub times: Vec<(Lines, u64)>,
    pub walk_time: i32,
    api_key: String,
}

impl StationHandler {
    pub fn new(api_key: String, line: Lines, station_code: String, walk_time: i32) -> Self {
        Self { api_key, line, station_code, times: vec![], walk_time }
    }

    pub fn refresh(&mut self) {
        self.times.clear();
        let uri = self.line.to_uri();
        let resp = minreq::get(uri).with_header("x-api-key", &self.api_key).send().unwrap();
        let bytes = resp.as_bytes();
        let feed = match gtfsrt::FeedMessage::decode(bytes) { // if no data so abort
            Ok(a) => a,
            Err(_) => return,
        };
        for entity in feed.entity {
            if let Some(tu) = entity.trip_update {
                for stop in tu.stop_time_update {
                    if stop.stop_id() == self.station_code {
                        let time = stop.arrival.unwrap().time();
                        let secs: u64 = if u64::try_from(time).unwrap() < SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() { // Does this break once the year gets too high?
                            0
                        } else {
                            u64::try_from(time).unwrap() - SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() 
                        };
                        // Parsing trip id for train name as defined in https://api.mta.info/GTFS.pdf
                        // Shouldn't break unless trip id is changed
                        let parsed_tid = tu.trip.trip_id().split("_").last().unwrap();
                        let parsed_route = parsed_tid.split("..").next().unwrap();
                        let route = Lines::to_line(parsed_route);
                        self.times.push((route, secs/60));
                    }
                }
            }
        }
    }

    pub fn serialize(&self) -> StationInfo {
        let times = self.get_time_map();
        let mut train_info: Vec<TrainInfo> = vec![];
        for key in times.keys() {
            let mut min_away = times.get(key).unwrap().clone(); // Literally has to exist
            min_away.sort();
            train_info.push(TrainInfo { 
                color: slint::Brush::SolidColor(key.to_slint_color()), route_name: key.to_string().into(), 
                times: Rc::new(VecModel::from(min_away)).into(),
            })
        }

        StationInfo { station_name: station_code_to_name(&self.station_code).into(), trains: Rc::new(VecModel::from(train_info)).into(), walk_time: self.walk_time }
    }

    fn get_time_map(&self) -> HashMap<Lines, Vec<i32>> {
        let mut map: HashMap<Lines, Vec<i32>> = HashMap::new();
        for (line, time) in self.times.clone() {
            if map.contains_key(&line) {
                map.get_mut(&line).unwrap().push(time.try_into().unwrap());
            } else {
                map.insert(line, vec![time.try_into().unwrap()]);
            }
        }
        map
    }
}

impl PartialOrd for StationHandler {
    // Can break for multiline stations
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        let mut selftime = match self.times.get(0) {
            Some(a) => a.1,
            None => return Some(Ordering::Greater),
        };
        for (_, time) in self.times.iter() {
            if time > &self.walk_time.try_into().unwrap() {
                selftime = *time;
                break;
            }
        }
        let mut othertime = match other.times.get(0) {
            Some(a) => a.1,
            None => return Some(Ordering::Less),
        };
        for (_, time) in other.times.iter() {
            if time > &other.walk_time.try_into().unwrap() {
                othertime = *time;
                break;
            }
        }
        
        Some(selftime.cmp(&othertime))
    }
}

impl PartialEq for StationHandler {
    fn eq(&self, other: &Self) -> bool {
        self.station_code == other.station_code && self.line == other.line
    }
}

impl Eq for StationHandler {}
impl Ord for StationHandler {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(other).unwrap()
    }
}

impl Lines {
    fn to_slint_color(&self) -> Color {
        match self {
            //Lines::A | Lines::C | Lines::E => ,
            Lines::B | Lines::D | Lines::F | Lines::M => Color::from_rgb_u8(255, 99, 25), 
            //Lines::G => ,
            //Lines::J | Lines::Z => ,
            //Lines::N | Lines::Q | Lines::R | Lines::W => ,
            //Lines::L => ,
            //Lines::_1 | Lines::_2 | Lines::_3 => ,
            Lines::_4 | Lines::_5 | Lines::_6 => Color::from_rgb_u8(0, 147, 60),
            //Lines::_7 => ,
            //Lines::SIR => ,
            _ => Color::from_rgb_u8(0, 147, 60),
        }
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
    pub times: HashMap<String, HashMap<String, Vec<i32>>>,
    pub stop_id: Vec<String>,
}

impl BusStopHandler {
    pub fn new(api_key: String, stop_id: Vec<String>) -> Self {
        Self {api_key, stop_id, times: HashMap::new()}
    }

    // Support for stops that are broken into dir 1 and dir 2
    pub fn refresh(&mut self) {
        self.times.clear();
        let ids = self.stop_id.clone();
        let time_now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs().try_into().unwrap();
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
            .send() {
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
                let route_name = visit.monitored_vehicle_journey.published_line_name.get(0).unwrap();
                let dest = visit.monitored_vehicle_journey.destination_name.get(0).unwrap();
                let time = visit.monitored_vehicle_journey.monitored_call.expected_arrival_time.unwrap_or("Now".to_owned()); // If it isn't given, bus is at stop waiting to leave
                let mut min_away = 0;
                // Let the cursed code begin
                // Unwraps should be fine if the MTA doesn't change the time format they are using
                if time != "Now".to_owned() {
                    let mut thing = time.split(".");
                    let mut time = thing.next().unwrap().split("T");
                    // It is a limitation to hardcode this, but MTA is in eastern time so it will
                    // be either 5 (est) or 4 (edt)
                    let offset = if thing.next().unwrap().split("-").last().unwrap().contains("5") {
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
                        day.get(2).unwrap().parse().unwrap()
                        ).unwrap();
                    // I am sorry for this crime of a line
                    let time = Time::from_hms(secs.next().unwrap().parse().unwrap(), secs.next().unwrap().parse().unwrap(), secs.next().unwrap().parse().unwrap()).unwrap();
                    let mut datetime = OffsetDateTime::new_in_offset(date, time, UtcOffset::UTC);
                    datetime = datetime.saturating_add(time::Duration::hours(offset));
                    min_away = datetime.sub(now).whole_minutes();
                }
                // This feels like an abomination, probably because it is
                if !self.times.contains_key(route_name)  {
                    let mut map = HashMap::new();
                    map.insert(dest.to_owned(), vec![min_away.try_into().unwrap()]);
                    self.times.insert(route_name.to_owned(), map);
                } else {
                    if self.times.get(route_name).unwrap().contains_key(dest) {
                        self.times.get_mut(route_name).unwrap().get_mut(dest).unwrap().push(min_away.try_into().unwrap());
                    } else {
                        self.times.get_mut(route_name).unwrap().insert(dest.to_owned(), vec![min_away.try_into().unwrap()]);
                    }
                }
            }
        }
    }

    pub fn serialize(&self) -> BusStopInfo {
        let mut bus_info: Vec<BusInfo> = vec![];
        for key in self.times.keys() {
            let mut dests: Vec<(String, Vec<i32>)> = vec![];
            for dir in self.times.get(key).unwrap().keys() {
                let mut copyofdata: Vec<i32> = self.times.get(key).unwrap().get(dir).unwrap().to_owned();
                copyofdata.sort();
                copyofdata.truncate(3);
                dests.push((dir.into(), copyofdata));
            }
            bus_info.push(BusInfo { 
                downtown: dests.get(0).unwrap().0.clone().into(),
                downtown_times: Rc::new(VecModel::from(dests.get(0).unwrap().1.clone())).into(),
                name: key.into(),
                uptown: dests.get(1).unwrap_or(&("".to_owned(), vec![])).0.clone().into(),
                uptown_times: Rc::new(VecModel::from(dests.get(1).unwrap_or(&("".to_owned(), vec![])).1.clone())).into()
            });
        } 

        BusStopInfo { busses: Rc::new(VecModel::from(bus_info)).into(), stop_name: match &** self.stop_id.get(0).unwrap() {
            "100017" => "Paul Av/W 205th Street".into(),
            "100723" => "W 205 St/Paul Av".into(),
            "803061" => "W 205 St/Paul Av".into(),
            _ => "Err".into()
        } }
    }
}
