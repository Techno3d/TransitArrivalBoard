use std::io::Cursor;

use gtfs_structures::Gtfs;
use prost::Message;

use crate::{gtfsrt, mercury_structs::MercuryDelays};

// No bus because bus api can be queried per stop
#[derive(Default)]
pub struct FeedHandler {
  pub subway_feed: Vec<gtfsrt::FeedMessage>,
  pub service_alerts_feed: MercuryDelays,
  pub gtfs_static_feed: Gtfs,
}

impl FeedHandler {
  pub fn new() -> Self {
    FeedHandler { ..Default::default() }
  }

  pub fn refresh_realtime(&mut self) {
    self.subway_feed.clear();
    self.service_alerts_feed = Default::default();

    // Subway
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
      let resp = match minreq::get(uri).send() {
        Ok(a) => a,
        Err(_) => return, // HTTP request failed.
      };
      let bytes = resp.as_bytes();
      let feed = match gtfsrt::FeedMessage::decode(bytes) {
        Ok(a) => a,
        Err(_) => return,
      };
      self.subway_feed.push(feed);
    }

    // Service Alerts
    let resp = minreq::get("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json")
      .send()
      .unwrap();
    let bytes = resp.as_bytes();
    let alerts: MercuryDelays = match serde_json::from_slice(bytes) {
      Ok(r) => r,
      Err(_) => Default::default(),
    };
    self.service_alerts_feed = alerts;
  }

  pub fn refresh_static(&mut self) {
    let resp = minreq::get("http://web.mta.info/developers/data/nyct/subway/google_transit.zip")
      .send()
      .unwrap();
    let bytes = resp.as_bytes();
    let gtfs = match Gtfs::from_reader(Cursor::new(bytes)) {
      Ok(a) => a,
      Err(_) => return,
    };
    self.gtfs_static_feed = gtfs;
  }
}
