use std::cmp::Ordering;

use gtfs_structures::Gtfs;
use serde::{Deserialize, Serialize};

use crate::mercury::MercuryDelays;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceAlertHandler {
    pub severity_limit: i32,
    pub subway: Vec<Disruption>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Disruption {
    pub route: String,
    pub priority: i32,
    pub header: String,
}

impl ServiceAlertHandler {
    pub fn new(severity_limit: i32) -> Self {
        Self {
            severity_limit,
            subway: Vec::new(),
        }
    }

    pub fn refresh(&mut self) {
        let gtfs = match Gtfs::from_url(
            "http://web.mta.info/developers/data/nyct/subway/google_transit.zip",
        ) {
            Ok(a) => a,
            Err(_) => return,
        };
        let resp2 = minreq::get(
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        )
        .send()
        .unwrap();
        let bytes = resp2.as_bytes();
        let delays: MercuryDelays = match serde_json::from_slice(bytes) {
            Ok(r) => r,
            Err(_) => Default::default(),
        };
        for entity in delays.entity {
            let alert = entity.alert.unwrap();
            for informed in alert.informed_entity.unwrap().iter() {
                if let Some(selector) = &informed.transit_realtime_mercury_entity_selector {
                    let decomposed: Vec<&str> = selector.sort_order.split(":").collect();
                    let line = informed.route_id.as_ref().unwrap();
                    let gtfs_route = match gtfs.get_route(&line) {
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
                                .clone(),
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
