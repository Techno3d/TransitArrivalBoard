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
        FeedHandler {
            ..Default::default()
        }
    }

    pub fn refresh_feeds(&mut self) {
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

        self.subway_feed.clear();
        self.service_alerts_feed = Default::default();

        for uri in feed_uris {
            let resp = minreq::get(uri).send().unwrap();
            let bytes = resp.as_bytes();
            let feed = match gtfsrt::FeedMessage::decode(bytes) {
                // if no data so abort
                Ok(a) => a,
                Err(_) => return,
            };
            self.subway_feed.push(feed);
        }
        // Delays
        let delays_resp = minreq::get(
            "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
        )
        .send()
        .unwrap();
        let bytes = delays_resp.as_bytes();
        let delays: MercuryDelays = match serde_json::from_slice(bytes) {
            Ok(r) => r,
            Err(_) => Default::default(),
        };
        self.service_alerts_feed = delays;
    }

    /// Use sparingly, the static only updates a few times a year and is a big file
    pub fn refresh_static_gtfs(&mut self) {
        let resp =
            minreq::get("http://web.mta.info/developers/data/nyct/subway/google_transit.zip")
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
