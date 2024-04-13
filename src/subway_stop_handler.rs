use std::{collections::HashMap, time::{SystemTime, UNIX_EPOCH}};

use gtfs_structures::Gtfs;
use prost::Message;

use crate::{gtfsrt, Stop, Vehicle};

#[derive(Debug, Clone)]
pub struct SubwayStopHandler {
    pub stop_ids: Vec<String>,
    pub walk_time: i32,
    pub trips: Vec<Vehicle>,
    pub routes: HashMap<String, HashMap<String, Vec<Vehicle>>>,
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
