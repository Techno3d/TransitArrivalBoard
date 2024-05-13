export interface Vehicle {
  route_id: string;
  route_name: string;
  destination_id: string;
  destination_name: string;
  minutes_until_arrival: number;
}

export interface Stop {
  name: string;
  trips: Array<Vehicle>;
  routes: Record<string, Record<string, Array<Vehicle>>>;
}

export interface Alert {
  route_id: string;
  sort_order: number;
  header_text: string;
}

export interface Info {
  stops_realtime: Record<string, Stop>;
  service_alerts_realtime: Array<Alert>;
  routes_static: Record<String, unknown>;
}

export interface Config {
  subway: Array<StopConfig>;
  bus: Array<StopConfig>;
}

export interface StopConfig {
  stop_ids: Array<string>;
  walk_time: number;
}
