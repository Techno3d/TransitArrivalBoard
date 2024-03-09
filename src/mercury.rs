use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MercuryDelays {
    pub header: Header,
    pub entity: Vec<Entity>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Header {
    pub gtfs_realtime_version: Option<String>,
    pub incrementality: Option<String>,
    pub timestamp: Option<i64>,
    pub transit_realtime_mercury_feed_header: Option<FeedHeader>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedHeader {
    pub mercury_version: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Entity {
    pub id: Option<String>,
    pub alert: Option<Alert>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Alert {
    pub active_period: Option<Vec<Periods>>,
    pub informed_entity: Option<Vec<InformedEntity>>,
    pub header_text: Option<HeaderText>,
    pub description_text: Option<TranslateHolder>,
    pub transit_realtime_mercury_alert: Option<MercuryAlert>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Periods {
    pub start: Option<i64>,
    pub end: Option<i64>,
}


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InformedEntity {
    pub agency_ed: Option<String>,
    pub route_id: Option<String>,
    pub transit_realtime_mercury_entity_selector: Option<MercurySelector>,
    pub stop_id: Option<String>,
}


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MercurySelector {
    pub sort_order: String,
}


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct HeaderText {
    pub translation: Option<Vec<Translation>>,
}


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct TranslateHolder {
    translation: Vec<Translation>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Translation {
    pub text: Option<String>,
    pub language: Option<String>,
}


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MercuryAlert {
    pub created_at: i64,
    pub updated_at: i64,
    pub alert_type: String,
    pub display_before_active: Option<i32>,
    pub human_readable_active_period: Option<TranslateHolder>,
}
