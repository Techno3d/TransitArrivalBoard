import { createContext } from "react";
import { type Status } from "../components/StatusBar";
import { type Alert, type Route, type Stop } from "../types";

export const SocketContext = createContext<{
  stops: Record<string, Stop>;
  routes: Record<string, Route>;
  alerts: Array<Alert>;
  status: Status;
}>({
  stops: {},
  routes: {},
  alerts: [],
  status: {
    type: "ERROR",
    message: "Offline",
  },
});
