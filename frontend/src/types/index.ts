export type Alert = { route_id: string; sort_order: number; header_text: string };

export type Route = {
  route_id: string;
  route_name: string;
  route_color: string;
  route_text_color: string;
  route_sort_order: number;
};

export type Vehicle = {
  route_id: string;
  route_name: string;
  destination_id: string;
  destination_name: string;
  direction: string;
  minutes_until_arrival: number;
};

export type Stop = {
  name: string;
  trips: Array<Vehicle>;
  destinations: Record<string, Record<string, Array<Vehicle>>>;
};
