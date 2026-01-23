import type { Alert } from "./Alert";
import type { Route } from "./Route";
import type { Stop } from "./Stop";

export type Import = { stops_realtime: { [key: string]: Stop }, service_alerts_realtime: Array<Alert>, routes_static: { [key: string]: Route }, };