use std::{
  cmp::Ordering,
  sync::{Arc, RwLock},
};

use serde::{Deserialize, Serialize};

use crate::{feed_handler::FeedHandler, Alert};

#[derive(Clone, Serialize, Deserialize)]
pub struct ServiceAlertHandler {
  pub subway: Vec<Alert>,
  #[serde(skip)]
  feed_data: Arc<RwLock<FeedHandler>>,
}

impl ServiceAlertHandler {
  pub fn new(data: Arc<RwLock<FeedHandler>>) -> Self {
    Self {
      subway: Vec::new(),
      feed_data: data,
    }
  }

  pub fn refresh(&mut self) {
    self.subway.clear();

    // If RwLock poisined, should crash
    let data = self.feed_data.read().unwrap();

    if data.service_alerts_realtime_feed.is_none() {
      return;
    }

    for entity in data.service_alerts_realtime_feed.to_owned().unwrap().entity {
      let alert = match entity.alert {
        Some(a) => a,
        None => continue,
      };

      let informed_entities = match alert.informed_entity {
        Some(a) => a,
        None => continue,
      };
      for informed in informed_entities.iter() {
        if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
          let decomposed: Vec<&str> = selector.sort_order.split(':').collect();
          // If the selector formating changes, then we need to change. This would become a bug, so
          // should crash
          let severity = (decomposed.get(2).unwrap()).parse().unwrap_or(0);
          let route_id = match informed.route_id.as_ref() {
            Some(a) => a,
            None => continue,
          };

          self.subway.push(Alert {
            // Should always have a route_id
            route_id: route_id.to_string(),
            sort_order: severity,
            // If header text exists, translation text should
            header_text: match alert.header_text {
              Some(ref a) => a
                .translation
                .as_ref()
                .unwrap()
                .first()
                .unwrap()
                .text
                .as_ref()
                .unwrap()
                .to_owned(),
              None => "".to_owned(),
            },
          });
        }

        self.subway.sort_by(|a, b| {
          if a.sort_order > b.sort_order {
            return Ordering::Greater;
          }
          if a.sort_order < b.sort_order {
            return Ordering::Less;
          }
          Ordering::Equal
        });
      }
    }
  }
}
