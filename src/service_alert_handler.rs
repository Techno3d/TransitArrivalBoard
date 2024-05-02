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

    let data = self.feed_data.read().unwrap();
    for entity in &data.service_alerts_realtime_feed.entity {
      let alert = entity.alert.as_ref().unwrap();
      for informed in alert.informed_entity.as_ref().unwrap().iter() {
        if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
          let decomposed: Vec<&str> = selector.sort_order.split(':').collect();
          let severity = (decomposed.get(2).unwrap()).parse().unwrap_or(0);

          self.subway.push(Alert {
            route_id: informed.route_id.as_ref().unwrap().to_string(),
            sort_order: severity,
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
