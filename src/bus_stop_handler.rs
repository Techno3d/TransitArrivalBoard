use time::{Date, OffsetDateTime, Time, UtcOffset};

use crate::{siri_structs::BusData, Stop, Vehicle};
use std::{
    cmp::Ordering,
    collections::HashMap,
    ops::Sub,
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

pub struct BusStopHandler {
    api_key: Arc<String>,
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
}

impl BusStopHandler {
    pub fn new(api_key: Arc<String>, stop_ids: Vec<String>, walk_time: i32) -> Self {
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
        let current_time = OffsetDateTime::from_unix_timestamp(
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs()
                .try_into()
                .unwrap(),
        )
        .unwrap();
        for id in ids.iter() {
            self.refresh_single(id, current_time);
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

    fn refresh_single(&mut self, stop_id: &String, current_time: OffsetDateTime) {
        let response = match minreq::get("https://bustime.mta.info/api/siri/stop-monitoring.json")
            .with_param("key", &*self.api_key)
            .with_param("version", "2")
            .with_param("OperatorRef", "MTA")
            .with_param("MonitoringRef", stop_id)
            .send()
        {
            Ok(x) => x,
            Err(_) => return, // No data
        };
        let data: BusData = match serde_json::from_slice(response.as_bytes()) {
            Ok(x) => x,
            Err(_) => return,
        };
        let service = match data.siri.service_delivery {
            Some(x) => x,
            None => return,
        };
        for stop_data in service.stop_monitoring_delivery {
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
                let destination_id = visit
                    .monitored_vehicle_journey
                    .destination_ref
                    .split("_")
                    .last()
                    .unwrap();
                let arrival_time = visit
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
                if arrival_time != "Now".to_owned() {
                    let mut arrival_time = arrival_time.split(".");
                    let mut arrival_time = arrival_time.next().unwrap().split("T");
                    // It is a limitation to hardcode this, but MTA is in eastern time so it will
                    // be either 5 (est) or 4 (edt)
                    let offset = if arrival_time
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
                    let duration_day: Vec<&str> = arrival_time.next().unwrap().split("-").collect();
                    let mut duration_secs = arrival_time.next().unwrap().split(":");
                    let parse = duration_day.get(1).unwrap().parse::<i32>();
                    let date = Date::from_calendar_date(
                        duration_day.get(0).unwrap().parse().unwrap(),
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
                        duration_day.get(2).unwrap().parse().unwrap(),
                    )
                    .unwrap();
                    // I am sorry for this crime of a line
                    let arrival_time = Time::from_hms(
                        duration_secs.next().unwrap().parse().unwrap(),
                        duration_secs.next().unwrap().parse().unwrap(),
                        duration_secs.next().unwrap().parse().unwrap(),
                    )
                    .unwrap();
                    let mut datetime =
                        OffsetDateTime::new_in_offset(date, arrival_time, UtcOffset::UTC);
                    datetime = datetime.saturating_add(time::Duration::hours(offset));
                    min_away = datetime.sub(current_time).whole_minutes();
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
                    .contains_key(destination_id)
                {
                    self.routes
                        .get_mut(route_id)
                        .unwrap()
                        .insert(destination_id.to_owned(), Vec::new());
                };

                self.routes
                    .get_mut(route_id)
                    .unwrap()
                    .get_mut(destination_id)
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
