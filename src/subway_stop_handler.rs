use std::{
  cmp::Ordering,
  collections::BTreeMap,
  sync::{Arc, RwLock},
  time::{SystemTime, UNIX_EPOCH},
};

use crate::{feed_handler::FeedHandler, Stop, Vehicle};

pub struct SubwayStopHandler {
  pub stop_ids: Vec<String>,
  pub walk_time: i32,
  pub trips: Vec<Vehicle>,
  pub routes: BTreeMap<String, BTreeMap<String, Vec<Vehicle>>>,
  feed_data: Arc<RwLock<FeedHandler>>,
}

impl SubwayStopHandler {
  pub fn new(stop_ids: Vec<String>, walk_time: i32, feed_data: Arc<RwLock<FeedHandler>>) -> Self {
    Self {
      stop_ids,
      walk_time,
      trips: Vec::new(),
      routes: BTreeMap::new(),
      feed_data,
    }
  }

  pub fn refresh(&mut self) {
    self.trips.clear();
    self.routes.clear();

    let current_time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();

    let data = self.feed_data.read().unwrap();
    for message in data.subway_feed.iter() {
      for entity in &message.entity {
        if let Some(trip_update) = &entity.trip_update {
          for stop in trip_update.stop_time_update.iter() {
            if self.stop_ids.contains(&stop.stop_id().to_string()) {
              // Duration
              let arrival_time = (match &stop.arrival {
                Some(a) => a,
                None => continue,
              })
              .time();
              let arrival_time = u64::try_from(arrival_time).unwrap();
              let duration = ((arrival_time - current_time).max(0) / 60) as i32;

              // Route
              let route_id = trip_update
                .trip
                .trip_id()
                .split('_')
                .last()
                .unwrap()
                .split("..")
                .next()
                .unwrap();
              let route_name = match data.gtfs_static_feed.get_route(route_id) {
                Ok(a) => a.short_name.as_ref().unwrap(),
                Err(_) => return,
              };

              // Destination
              let destination_id = trip_update.stop_time_update.last().unwrap().stop_id();
              let destination_name = match data.gtfs_static_feed.get_stop(destination_id) {
                Ok(a) => a.name.as_ref().unwrap(),
                Err(_) => return,
              };

              // Input data into trips
              self.trips.push(Vehicle {
                route: route_name.to_owned(),
                destination: destination_name.to_owned(),
                minutes_until_arrival: duration,
              });

              // Input data into routes
              if !self.routes.contains_key(route_id) {
                self.routes.insert(route_id.to_owned(), BTreeMap::new());
              }
              if !self.routes.get(route_id).unwrap().contains_key(destination_id) {
                self
                  .routes
                  .get_mut(route_id)
                  .unwrap()
                  .insert(destination_id.to_owned(), Vec::new());
              };
              self
                .routes
                .get_mut(route_id)
                .unwrap()
                .get_mut(destination_id)
                .unwrap()
                .push(Vehicle {
                  route: route_name.to_owned(),
                  destination: destination_name.to_owned(),
                  minutes_until_arrival: duration,
                });
            }
          }
        }
      }
    }

    self.trips.sort_by(|a, b| {
      if a.minutes_until_arrival > b.minutes_until_arrival {
        return Ordering::Greater;
      }
      if a.minutes_until_arrival < b.minutes_until_arrival {
        return Ordering::Less;
      }
      Ordering::Equal
    });
  }

  pub fn serialize(&self) -> Stop {
    Stop {
      trips: self.trips.to_owned(),
      routes: self.routes.to_owned(),
      walk_time: self.walk_time,
    }
  }

  pub fn predict(&self) {}
}
