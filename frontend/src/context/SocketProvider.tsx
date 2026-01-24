import { type ReactNode, useEffect, useState } from "react";
import config from "../../../config.json";
import { type Status } from "../components/StatusBar";
import { type Alert, type Export, type Import, type Route, type Stop } from "../types";
import { SocketContext } from "./SocketContext";

export function SocketProvider({ children }: { children: ReactNode }) {
  const [stops, setStops] = useState<Record<string, Stop>>({});
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [alerts, setAlerts] = useState<Array<Alert>>([]);
  const [status, setStatus] = useState<Status>({
    type: "ERROR",
    message: "Offline",
  });

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9001");

    ws.onopen = () => {
      console.log("Websocket opened.");
      setStatus({ type: "WARNING", message: "Waiting for response" });

      const message: Export = { subway: [], bus: [] };

      Object.values(config.subway).forEach((value) => {
        message.subway.push(value.stop_ids);
      });

      Object.values(config.bus).forEach((value) => {
        message.bus.push(value.stop_ids);
      });

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      console.log("Message recieved.");
      console.log(event.data);

      if (event.data == "Possible Connection Issue") {
        setStatus({ type: "WARNING", message: "No Internet" });
        return;
      }

      const data: Import = JSON.parse(event.data);

      setStops(data.stops_realtime);
      setRoutes(data.routes_static);
      setAlerts(data.service_alerts_realtime);
      setStatus({ type: "OK", message: "Connected" });
    };

    ws.onerror = () => {
      console.log("Websocket errored.");
      setStatus({ type: "ERROR", message: "Offline" });

      ws.close();
    };

    ws.onclose = () => {
      console.log("Websocket closed.");
      setStatus({ type: "ERROR", message: "Offline" });

      ws.close();
    };

    return () => {
      console.log("Closing old websocket...");
      setStatus({ type: "ERROR", message: "Offline" });

      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ stops: stops, routes: routes, alerts: alerts, status: status }}>
      {children}
    </SocketContext.Provider>
  );
}
