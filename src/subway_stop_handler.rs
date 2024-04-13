use std::{collections::HashMap, sync::{Arc, RwLock}, time::{SystemTime, UNIX_EPOCH}};

use crate::{feed_data::FeedData, Stop, Vehicle};

pub struct SubwayStopHandler {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
    feed_data: Arc<RwLock<FeedData>>,
}

impl SubwayStopHandler {
    pub fn new(stop_ids: Vec<String>, walk_time: i32, feed_data: Arc<RwLock<FeedData>>) -> Self {
        Self {
            stop_ids,
            walk_time,
            trips: vec![],
            routes: HashMap::new(),
            feed_data,
        }
    }

    pub fn refresh(&mut self) {
        self.trips.clear();

        let data = self.feed_data.read().unwrap();
        for feed in data.subway_feed.iter() {
            for entity in &feed.entity {
                if let Some(tu) = &entity.trip_update {
                    for stop in tu.stop_time_update.iter() {
                        if self.stop_ids.contains(&stop.stop_id().to_string()) {
                            let time = (match &stop.arrival {
                                Some(a) => a,
                                None => continue,
                            })
                            .time();
                            let secs: u64 = if u64::try_from(time).unwrap() < SystemTime::now()
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

                            let gtfs_route = match data.static_gtfs.get_route(parsed_route) {
                                Ok(a) => a.short_name.as_ref().unwrap(),
                                Err(_) => return,
                            };

                            let gtfs_destination = match data.static_gtfs.get_stop(parsed_destination) {
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
