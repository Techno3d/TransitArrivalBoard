use chrono::{DateTime, Local};

use crate::{siri_structs::BusData, Stop, Vehicle};
use std::{cmp::Ordering, collections::BTreeMap, sync::Arc};

#[derive(Debug, Clone)]
pub struct BusStopHandler {
  pub stop_ids: Vec<String>,
  pub walk_time: i32,
  pub trips: Vec<Vehicle>,
  pub routes: BTreeMap<String, BTreeMap<String, Vec<Vehicle>>>,
  api_key: Arc<String>,
}

impl BusStopHandler {
  pub fn new(stop_ids: Vec<String>, walk_time: i32, api_key: Arc<String>) -> Self {
    Self {
      stop_ids,
      walk_time,
      trips: Vec::new(),
      routes: BTreeMap::new(),
      api_key,
    }
  }

  pub fn refresh(&mut self) {
    self.trips.clear();
    self.routes.clear();

    let current_time = Local::now();

    for id in self.stop_ids.to_owned().iter() {
      let resp = match minreq::get("https://bustime.mta.info/api/siri/stop-monitoring.json")
        .with_param("key", &*self.api_key)
        .with_param("version", "2")
        .with_param("OperatorRef", "MTA")
        .with_param("MonitoringRef", id)
        .send()
      {
        Ok(a) => a,
        Err(_) => {
          self.predict();
          return;
        } // HTTP request failed.
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
          // Duration
          let arrival_time = visit
            .monitored_vehicle_journey
            .monitored_call
            .expected_departure_time
            .unwrap_or(current_time.to_rfc3339());
          let arrival_time = DateTime::parse_from_rfc3339(arrival_time.as_str()).unwrap();
          let duration = ((arrival_time.timestamp() - current_time.timestamp()).max(0) / 60) as i32;

          // Route
          let route_id = visit.monitored_vehicle_journey.line_ref.split('_').last().unwrap();
          let route_name = visit.monitored_vehicle_journey.published_line_name.first().unwrap();

          // Destination
          let destination_id = visit
            .monitored_vehicle_journey
            .destination_ref
            .split('_')
            .last()
            .unwrap();
          let destination_name = visit
            .monitored_vehicle_journey
            .destination_name
            .first()
            .unwrap()
            .split(" via ")
            .next()
            .unwrap();

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
