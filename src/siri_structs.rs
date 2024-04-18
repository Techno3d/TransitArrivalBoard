use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct BusData {
  pub siri: Siri,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Siri {
  pub service_delivery: Option<ServiceDelivery>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct ServiceDelivery {
  pub response_timestamp: String,
  pub stop_monitoring_delivery: Vec<StopMonitoringDelivery>,
  pub situation_exchange_delivery: Option<Vec<SituationExchangeDelivery>>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct StopMonitoringDelivery {
  pub monitored_stop_visit: Option<Vec<MonitoredStopVisit>>,
  pub response_timestamp: String,
  pub valid_until: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredStopVisit {
  pub monitored_vehicle_journey: MonitoredVehicleJourney,
  pub recorded_at_time: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredVehicleJourney {
  pub line_ref: String,
  pub framed_vehicle_journey_ref: FramedVehicleJourneyRef,
  pub journey_pattern_ref: String,
  pub published_line_name: Vec<String>,
  pub operator_ref: String,
  pub origin_ref: String,
  pub destination_ref: String,
  pub destination_name: Vec<String>,
  pub situation_ref: Option<Vec<SituationRef>>,
  pub monitored: bool,
  pub vehicle_location: Location,
  pub bearing: f64,
  pub progress_rate: String,
  pub block_ref: Option<String>,
  pub vehicle_ref: String,
  pub monitored_call: MonitoredCall,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct FramedVehicleJourneyRef {
  pub data_frame_ref: String,
  pub dated_vehicle_journey_ref: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SituationRef {
  pub situation_simple_ref: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Location {
  pub longitude: f64,
  pub latitude: f64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredCall {
  pub aimed_arrival_time: Option<String>,
  pub expected_arrival_time: Option<String>,
  pub arrival_proximity_text: Option<String>,
  pub expected_departure_time: Option<String>,
  pub distance_from_stop: i32,
  pub number_of_stops_away: i32,
  pub stop_point_ref: String,
  pub visit_number: i32,
  pub stop_point_name: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SituationExchangeDelivery {
  pub situations: Situations,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Situations {
  pub pt_situation_element: Vec<PtSituationElement>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PtSituationElement {
  pub publication_window: PublicationWindow,
  pub severity: String,
  pub summary: Vec<String>,
  pub description: Vec<String>,
  pub situation_number: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PublicationWindow {
  pub start_time: String,
  pub end_time: String,
}
