use std::cmp::Ordering;
use std::collections::HashMap;
use std::ops::Sub;
use std::time::{SystemTime, UNIX_EPOCH};

use gtfs_structures::{self, Gtfs};
use mercury::MercuryDelays;
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
pub struct SubwayStopHandler {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
}

#[derive(Debug, Clone)]
pub struct BusStopHandler {
    api_key: String,
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceAlertHandler {
    pub severity_limit: i32,
    pub subway: Vec<Disruption>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vehicle {
    pub route: String,
    pub destination: String,
    pub minutes_until_arrival: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Disruption {
    pub route: String,
    pub priority: i32,
    pub header: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stop {
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
    pub walk_time: i32,
}

impl SubwayStopHandler {
    pub fn new(stop_ids: Vec<String>, walk_time: i32) -> Self {
        Self {
            stop_ids,
            walk_time,
            trips: vec![],
            routes: HashMap::new(),
        }
    }

    pub fn refresh(&mut self) {
        self.trips.clear();

        let gtfs = match Gtfs::from_url(
            "http://web.mta.info/developers/data/nyct/subway/google_transit.zip",
        ) {
            Ok(a) => a,
            Err(_) => return,
        };

        let feed_uris = [
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
        ];

        for uri in feed_uris {
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
                        if self.stop_ids.contains(&stop.stop_id().to_string()) {
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
                            let parsed_destination = tu.stop_time_update.last().unwrap().stop_id();

                            let gtfs_route = match gtfs.get_route(parsed_route) {
                                Ok(a) => a.short_name.as_ref().unwrap(),
                                Err(_) => return,
                            };

                            let gtfs_destination = match gtfs.get_stop(parsed_destination) {
                                Ok(a) => a.name.as_ref().unwrap(),
                                Err(_) => return,
                            };

                            self.trips.push(Vehicle {
                                route: gtfs_route.to_owned(),
                                destination: gtfs_destination.to_owned(),
                                minutes_until_arrival: secs as i32 / 60,
                            });

                            if !self.routes.contains_key(parsed_route) {
                                self.routes.insert(parsed_route.to_owned(), HashMap::new());
                            }

                            if !self
                                .routes
                                .get(parsed_route)
                                .unwrap()
                                .contains_key(parsed_destination)
                            {
                                self.routes
                                    .get_mut(parsed_route)
                                    .unwrap()
                                    .insert(parsed_destination.to_owned(), Vec::new());
                            };

                            self.routes
                                .get_mut(parsed_route)
                                .unwrap()
                                .get_mut(parsed_destination)
                                .unwrap()
                                .push(Vehicle {
                                    route: gtfs_route.to_owned(),
                                    destination: gtfs_destination.to_owned(),
                                    minutes_until_arrival: secs as i32 / 60,
                                });
                        }
                    }
                }
            }
        }
    }

    pub fn serialize(&self) -> Stop {
        Stop {
            trips: self.trips.to_owned(),
            routes: self.routes.to_owned(),
            walk_time: self.walk_time,
        }
    }
}

impl BusStopHandler {
    pub fn new(api_key: String, stop_ids: Vec<String>, walk_time: i32) -> Self {
        Self {
            api_key,
            stop_ids,
            walk_time,
            trips: vec![],
            routes: HashMap::new(),
        }
    }

    // Support for stops that are broken into dir 1 and dir 2
    pub fn refresh(&mut self) {
        self.trips.clear();
        let ids = self.stop_ids.to_owned();
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

        self.trips.sort_by(|x, y| {
            if x.minutes_until_arrival > y.minutes_until_arrival {
                return Ordering::Greater;
            } else if x.minutes_until_arrival < y.minutes_until_arrival {
                return Ordering::Less;
            }
            return Ordering::Equal;
        });
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
        let data: BusData = match serde_json::from_slice(resp.as_bytes()) {
            Ok(a) => a,
            Err(_) => return,
        };
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
                let route_name = visit
                    .monitored_vehicle_journey
                    .published_line_name
                    .get(0)
                    .unwrap();
                let route_id = visit
                    .monitored_vehicle_journey
                    .line_ref
                    .split("_")
                    .last()
                    .unwrap();
                let destination_name = visit
                    .monitored_vehicle_journey
                    .destination_name
                    .get(0)
                    .unwrap()
                    .split(" via ")
                    .next()
                    .unwrap();
                let destination_ref = visit
                    .monitored_vehicle_journey
                    .destination_ref
                    .split("_")
                    .last()
                    .unwrap();
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

                self.trips.push(Vehicle {
                    route: route_name.to_owned(),
                    destination: destination_name.to_owned(),
                    minutes_until_arrival: min_away.try_into().unwrap(),
                });

                if !self.routes.contains_key(route_id) {
                    self.routes.insert(route_id.to_owned(), HashMap::new());
                }

                if !self
                    .routes
                    .get(route_id)
                    .unwrap()
                    .contains_key(destination_ref)
                {
                    self.routes
                        .get_mut(route_id)
                        .unwrap()
                        .insert(destination_ref.to_owned(), Vec::new());
                };

                self.routes
                    .get_mut(route_id)
                    .unwrap()
                    .get_mut(destination_ref)
                    .unwrap()
                    .push(Vehicle {
                        route: route_name.to_owned(),
                        destination: destination_name.to_owned(),
                        minutes_until_arrival: min_away.try_into().unwrap(),
                    });
            }
        }
    }

    pub fn serialize(&self) -> Stop {
        Stop {
            trips: self.trips.to_owned(),
            routes: self.routes.to_owned(),
            walk_time: 0,
        }
    }
}

impl ServiceAlertHandler {
    pub fn new(severity_limit: i32) -> Self {
        Self {
            severity_limit,
            subway: Vec::new(),
        }
    }

    pub fn refresh(&mut self) {
        let gtfs = match Gtfs::from_url(
            "http://web.mta.info/developers/data/nyct/subway/google_transit.zip",
        ) {
            Ok(a) => a,
            Err(_) => return,
        };
        let resp2 = minreq::get(
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        )
        .send()
        .unwrap();
        let bytes = resp2.as_bytes();
        let delays: MercuryDelays = match serde_json::from_slice(bytes) {
            Ok(r) => r,
            Err(_) => Default::default(),
        };
        for entity in delays.entity {
            let alert = entity.alert.unwrap();
            for informed in alert.informed_entity.unwrap().iter() {
                if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
                    let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                    let line = informed.route_id.as_ref().unwrap();
                    let gtfs_route = match gtfs.get_route(&line) {
                        Ok(a) => a.short_name.as_ref().unwrap(),
                        Err(_) => return,
                    };
                    let severity = match (*decomposed.get(2).unwrap()).parse() {
                        Ok(x) => x,
                        Err(_) => 0,
                    };

                    self.subway.push(Disruption {
                        route: gtfs_route.to_string(),
                        priority: severity,
                        header: match alert.header_text {
                            Some(ref a) => a
                                .translation
                                .as_ref()
                                .unwrap()
                                .get(0)
                                .unwrap()
                                .text
                                .as_ref()
                                .unwrap()
                                .clone(),
                            None => "".to_owned(),
                        },
                    });
                }

                self.subway.sort_by(|x, y| {
                    if x.priority > y.priority {
                        return Ordering::Greater;
                    } else if x.priority < y.priority {
                        return Ordering::Less;
                    }
                    return Ordering::Equal;
                });
            }
        }
    }
}
