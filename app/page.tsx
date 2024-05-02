"use client";

import { useEffect, useState } from "react";
import { Alert } from "./components/Alert";
import { Countdown } from "./components/Countdown";
import { List } from "./components/List";
import { Vehicle } from "./types";

export default function Home() {
  const [jeromeNames, setJeromeNames] = useState<string>("");
  const [jeromeTimes, setJeromeTimes] = useState<Array<Vehicle>>([]);
  const [concourseNames, setConcourseNames] = useState<string>("");
  const [concourseTimes, setConcourseTimes] = useState<Array<Vehicle>>([]);
  const [serviceAlerts, setServiceAlerts] = useState<Array<string>>([]);
  const [routes, setRoutes] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [paulNames, setPaulNames] = useState<string>("");
  const [paulTimes, setPaulTimes] = useState<{ [key: string]: { [key: string]: Array<Vehicle> } }>({});
  const [w205Names, setW205Names] = useState<string>("");
  const [w205Times, setW205Times] = useState<{ [key: string]: { [key: string]: Array<Vehicle> } }>({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9001");

    const config = {
      subway: [
        {
          stop_ids: ["405S"],
          display: "Countdown",
          walk_time: 10,
        },
        {
          stop_ids: ["D03S"],
          display: "Countdown",
          walk_time: 14,
        },
      ],
      bus: [
        {
          stop_ids: ["100017", "103400"],
          display: "List",
          walk_time: 3,
        },
        {
          stop_ids: ["100723"],
          display: "List",
          walk_time: 3,
        },
      ],
    };

    ws.onopen = () => {
      console.log("Websocket opened.");
      ws.send(JSON.stringify(config));
    };

    ws.onmessage = (event) => {
      console.log("Message recieved.");
      const message = JSON.parse(event.data);

      const jeromeName: string = message["stops_realtime"]["100017"]["stop_name"];
      setJeromeNames(jeromeName);

      const jeromeData: Vehicle[] = message["stops_realtime"]["100017"]["trips"];
      setJeromeTimes(jeromeData);

      const concouseName: string = message["stops_realtime"]["100723"]["stop_name"];
      setConcourseNames(concouseName);

      const concourseData: Vehicle[] = message["stops_realtime"]["100723"]["trips"];
      setConcourseTimes(concourseData);

      const delayData: Array<string> = [];

      const serviceData: Array<{ route_id: string; sort_order: number; header_text: string }> =
        message["service_alerts_realtime"];
      serviceData
        .slice()
        .reverse()
        .forEach((alert) => {
          if (delayData.indexOf(alert.header_text) !== -1) return;
          if (alert.sort_order < 22) return;
          delayData.push(alert.header_text);
        });
      setServiceAlerts(delayData);

      if (delayData.length > 0) {
        setIndex((i) => ((i % delayData.length) + delayData.length) % delayData.length);
      } else {
        setIndex(0);
      }

      const routeData: { [key: string]: { [key: string]: string } } = message["routes_static"];
      setRoutes(routeData);

      const paulName: string = message["stops_realtime"]["405S"]["stop_name"];
      setPaulNames(paulName);

      const paulData: { [key: string]: { [key: string]: Array<Vehicle> } } =
        message["stops_realtime"]["405S"]["routes"];
      setPaulTimes(paulData);

      const w205Name: string = message["stops_realtime"]["D03S"]["stop_name"];
      setW205Names(w205Name);

      const w205stData: { [key: string]: { [key: string]: Array<Vehicle> } } =
        message["stops_realtime"]["D03S"]["routes"];
      setW205Times(w205stData);
    };

    ws.onerror = (error) => {
      console.error("Websocket errored.", error);
    };

    ws.onclose = () => {
      console.log("Websocket closed.");
    };

    return () => {
      console.log("Websocket closing.");
      ws.close();
    };
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      if (serviceAlerts.length === 0) {
        setIndex(0);
        return;
      }
      setIndex((i) => (((i + 1) % serviceAlerts.length) + serviceAlerts.length) % serviceAlerts.length);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [serviceAlerts.length]);

  return (
    <div className="grid max-h-screen min-h-screen grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
      <div className="col-span-2 row-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Countdown name={jeromeNames} vehicles={jeromeTimes} routes={routes}></Countdown>
        <Countdown name={concourseNames} vehicles={concourseTimes} routes={routes}></Countdown>
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Alert name={"Service Alerts"} headers={serviceAlerts} routes={routes} index={index} />
      </div>
      <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
        <List name={paulNames} vehicles={paulTimes} routes={routes}></List>
        <List name={w205Names} vehicles={w205Times} routes={routes}></List>
      </div>
    </div>
  );
}
