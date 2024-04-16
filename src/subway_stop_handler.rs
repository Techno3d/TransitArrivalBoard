use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
    time::{SystemTime, UNIX_EPOCH},
};

use crate::{feed_handler::FeedHandler, Stop, Vehicle};

pub struct SubwayStopHandler {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
    feed_data: Arc<RwLock<FeedHandler>>,
}

impl SubwayStopHandler {
    pub fn new(stop_ids: Vec<String>, walk_time: i32, feed_data: Arc<RwLock<FeedHandler>>) -> Self {
        Self {
            stop_ids,
            walk_time,
            trips: Vec::new(),
            routes: HashMap::new(),
            feed_data,
        }
    }

    pub fn refresh(&mut self) {
        self.trips = Vec::new();
        self.routes = HashMap::new();

        let data = self.feed_data.read().unwrap();
        for message in data.subway_feed.iter() {
            for entity in &message.entity {
                if let Some(trip_update) = &entity.trip_update {
                    for stop in trip_update.stop_time_update.iter() {
                        if self.stop_ids.contains(&stop.stop_id().to_string()) {
                            let arrival_time = (match &stop.arrival {
                                Some(a) => a,
                                None => continue,
                            })
                            .time();
                            let duration_secs: u64 = if u64::try_from(arrival_time).unwrap()
                                < SystemTime::now()
                                    .duration_since(UNIX_EPOCH)
                                    .unwrap()
                                    .as_secs()
                            {
                                // Does this break once the year gets too high?
                                0
                            } else {
                                u64::try_from(arrival_time).unwrap()
                                    - SystemTime::now()
                                        .duration_since(UNIX_EPOCH)
                                        .unwrap()
                                        .as_secs()
                            };
                            // Parsing trip id for train name as defined in https://api.mta.info/GTFS.pdf
                            // Shouldn't break unless trip id is changed
                            let trip_id = trip_update.trip.trip_id().split("_").last().unwrap();
                            let mut trip_id = trip_id.split("..");
                            let route_id = trip_id.next().unwrap();
                            let destination_id =
                                trip_update.stop_time_update.last().unwrap().stop_id();

                            let route_name = match data.gtfs_static_feed.get_route(route_id) {
                                Ok(a) => a.short_name.as_ref().unwrap(),
                                Err(_) => return,
                            };

                            let destination_name =
                                match data.gtfs_static_feed.get_stop(destination_id) {
                                    Ok(a) => a.name.as_ref().unwrap(),
                                    Err(_) => return,
                                };

                            self.trips.push(Vehicle {
                                route: route_name.to_owned(),
                                destination: destination_name.to_owned(),
                                minutes_until_arrival: duration_secs as i32 / 60,
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
                                    minutes_until_arrival: duration_secs as i32 / 60,
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
