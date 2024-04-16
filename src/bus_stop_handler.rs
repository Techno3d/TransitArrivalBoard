use time::{Date, OffsetDateTime, Time, UtcOffset};

use crate::{siri_structs::BusData, Stop, Vehicle};
use std::{
    cmp::Ordering,
    collections::BTreeMap,
    ops::Sub,
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

#[derive(Debug, Clone)]
pub struct BusStopHandler {
    api_key: Arc<String>,
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: BTreeMap<String, BTreeMap<String, Vec<Vehicle>>>,
}

impl BusStopHandler {
    pub fn new(api_key: Arc<String>, stop_ids: Vec<String>, walk_time: i32) -> Self {
        Self {
            api_key,
            stop_ids,
            walk_time,
            trips: Vec::new(),
            routes: BTreeMap::new(),
        }
    }

    // Support for stops that are broken into dir 1 and dir 2
    pub fn refresh(&mut self) {
        self.trips.clear();
        self.routes.clear();

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
            }
            if x.minutes_until_arrival < y.minutes_until_arrival {
                return Ordering::Less;
            }
            Ordering::Equal
        });
    }

    fn refresh_single(&mut self, stopid: &String, now: OffsetDateTime) {
        let resp = match minreq::get("https://bustime.mta.info/api/siri/stop-monitoring.json")
            .with_param("key", &*self.api_key)
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
                    self.routes.insert(route_id.to_owned(), BTreeMap::new());
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
