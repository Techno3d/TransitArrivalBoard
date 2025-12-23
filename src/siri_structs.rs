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
  pub response_timestamp: Option<String>,
  pub stop_monitoring_delivery: Vec<StopMonitoringDelivery>,
  pub situation_exchange_delivery: Option<Vec<SituationExchangeDelivery>>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct StopMonitoringDelivery {
  pub monitored_stop_visit: Option<Vec<MonitoredStopVisit>>,
  pub response_timestamp: Option<String>,
  pub valid_until: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredStopVisit {
  pub monitored_vehicle_journey: MonitoredVehicleJourney,
  pub recorded_at_time: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredVehicleJourney {
  pub line_ref: String,
  pub direction_ref: Option<String>,
  pub framed_vehicle_journey_ref: Option<FramedVehicleJourneyRef>,
  pub journey_pattern_ref: Option<String>,
  pub published_line_name: Vec<String>,
  pub operator_ref: Option<String>,
  pub origin_ref: Option<String>,
  pub destination_ref: String,
  pub destination_name: Vec<String>,
  pub situation_ref: Option<Vec<SituationRef>>,
  pub monitored: Option<bool>,
  pub vehicle_location: Option<Location>,
  pub bearing: Option<f64>,
  pub progress_rate: Option<String>,
  pub block_ref: Option<String>,
  pub vehicle_ref: Option<String>,
  pub monitored_call: MonitoredCall,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct FramedVehicleJourneyRef {
  pub data_frame_ref: Option<String>,
  pub dated_vehicle_journey_ref: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SituationRef {
  pub situation_simple_ref: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Location {
  pub longitude: Option<f64>,
  pub latitude: Option<f64>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MonitoredCall {
  pub aimed_arrival_time: Option<String>,
  pub expected_arrival_time: Option<String>,
  pub arrival_proximity_text: Option<String>,
  pub expected_departure_time: Option<String>,
  pub distance_from_stop: Option<i32>,
  pub number_of_stops_away: Option<i32>,
  pub stop_point_ref: Option<String>,
  pub visit_number: Option<i32>,
  pub stop_point_name: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SituationExchangeDelivery {
  pub situations: Option<Situations>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct Situations {
  pub pt_situation_element: Option<Vec<PtSituationElement>>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PtSituationElement {
  pub publication_window: Option<PublicationWindow>,
  pub severity: Option<String>,
  pub summary: Option<Vec<String>>,
  pub description: Option<Vec<String>>,
  pub situation_number: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PublicationWindow {
  pub start_time: Option<String>,
  pub end_time: Option<String>,
}
