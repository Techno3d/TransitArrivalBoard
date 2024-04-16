use std::{
    cmp::Ordering,
    sync::{Arc, RwLock},
};

use serde::{Deserialize, Serialize};

use crate::{feed_handler::FeedHandler, Disruption};

#[derive(Clone, Serialize, Deserialize)]
pub struct ServiceAlertHandler {
    pub subway: Vec<Disruption>,
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
        let data = self.feed_data.read().unwrap();
        for entity in &data.service_alerts_feed.entity {
            let alert = entity.alert.as_ref().unwrap();
            for informed in alert.informed_entity.as_ref().unwrap().iter() {
                if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
                    let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                    let line = informed.route_id.as_ref().unwrap();
                    let gtfs_route = match data.gtfs_static_feed.get_route(&line) {
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
                                .to_owned(),
                            None => "".to_owned(),
                        },
                    });
                }

                self.subway.sort_by(|x, y| {
                    if x.priority > y.priority {
                        return Ordering::Greater;
                    }
                    if x.priority < y.priority {
                        return Ordering::Less;
                    }
                    Ordering::Equal
                });
            }
        }
    }
}
