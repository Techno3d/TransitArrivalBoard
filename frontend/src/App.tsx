import { useEffect, useState } from "react";
import { MessageList } from "./components/MessageList";
import { RouteList } from "./components/RouteList";
import { type Status, StatusBar } from "./components/StatusBar";
import { VehicleCountdown } from "./components/VehicleCountdown";
import { config } from "./config";
import { type Export, type Import, type Route, type Stop } from "./types";

export default function App() {
  const [status, setStatus] = useState<Status>({
    type: "ERROR",
    message: "Offline",
  });
  const [stops, setStops] = useState<Record<string, Stop>>({});
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [headers, setHeaders] = useState<Array<string>>([]);

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

      setStatus({ type: "OK", message: "Connected" });

      const message: Import = JSON.parse(event.data);
      setStops(message.stops_realtime);
      setRoutes(message.routes_static);

      const headers: Array<string> = [];
      message.service_alerts_realtime
        .slice()
        .reverse()
        .forEach((alert) => {
          if (headers.indexOf(alert.header_text) != -1) return;
          if (alert.sort_order < 22) return;
          headers.push(alert.header_text);
        });
      setHeaders(headers);
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
    <div className="flex h-full w-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div className="grid grow grid-flow-dense grid-cols-3 grid-rows-25 gap-2 bg-emerald-800 p-2 text-black">
        <div className="col-span-2 row-span-8">
          <VehicleCountdown
            stop={stops[config.subway[0].stop_ids[0]]}
            walk_time={config.subway[0].walk_time}
            routes={routes}
          ></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-8">
          <VehicleCountdown
            stop={stops[config.subway[1].stop_ids[0]]}
            walk_time={config.subway[1].walk_time}
            routes={routes}
          ></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-9">
          <MessageList name={"Service Alerts"} messages={headers} routes={routes} />
        </div>

        <div className="col-span-1 row-span-25">
          <RouteList
            stop={stops[config.bus[0].stop_ids[0]]}
            routes={routes}
            walk_time={config.bus[0].walk_time}
          ></RouteList>
        </div>
      </div>
      <StatusBar
        status={status}
        maintainers={[
          { name: "Shadman Syed", github_id: 76977073 },
          { name: "David Wang", github_id: 95447323 },
        ]}
      ></StatusBar>
    </div>
  );
}
