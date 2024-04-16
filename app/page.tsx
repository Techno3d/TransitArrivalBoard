"use client";

import { useEffect, useState } from "react";
import { Alert } from "./components/Alert";
import { Countdown } from "./components/Countdown";
import { List } from "./components/List";
import { Vehicle } from "./types";

export default function Home() {
  const [jeromeTimes, setJeromeTimes] = useState<Array<Vehicle>>([]);
  const [concourseTimes, setConcourseTimes] = useState<Array<Vehicle>>([]);
  const [serviceAlerts, setServiceAlerts] = useState<string>("");
  const [routes, setRoutes] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [paulTimes, setPaulTimes] = useState<{ [key: string]: { [key: string]: Array<Vehicle> } }>({});
  const [w205stTimes, setW205StTimes] = useState<{ [key: string]: { [key: string]: Array<Vehicle> } }>({});

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9001");

    const config = {
      subway: [
        {
          stop_ids: ["405S"],
          walk_time: 10,
        },
        {
          stop_ids: ["D03S"],
          walk_time: 14,
        },
      ],
      bus: [
        {
          stop_ids: ["100017", "103400"],
          walk_time: 3,
        },
        {
          stop_ids: ["100723"],
          walk_time: 3,
        },
      ],
    };

    ws.onopen = () => {
      console.log("WebSocket opened.");
      ws.send(JSON.stringify(config));
    };

    ws.onmessage = (event) => {
      console.log("Message recieved.");
      const message = JSON.parse(event.data);
      console.log(message);

      const jeromeData: Vehicle[] = message["subway"]["405S"]["trips"];
      console.log(jeromeData);
      setJeromeTimes(jeromeData);

      const concourseData: Vehicle[] = message["subway"]["D03S"]["trips"];
      console.log(concourseData);
      setConcourseTimes(concourseData);

      const serviceData: string = message["service_alerts"][message["service_alerts"].length - 1]["header"];
      console.log(serviceData);
      setServiceAlerts(serviceData);

      const routeData: { [key: string]: { [key: string]: string } } = message["routes"];
      console.log(routeData);
      setRoutes(routeData);

      const paulData: { [key: string]: { [key: string]: Array<Vehicle> } } = message["bus"]["100017"]["routes"];
      console.log(paulData);
      setPaulTimes(paulData);

      const w205stData: { [key: string]: { [key: string]: Array<Vehicle> } } = message["bus"]["100723"]["routes"];
      console.log(w205stData);
      setW205StTimes(w205stData);
    };

    ws.onerror = (error) => {
      console.error("Websocket errored.", error);
    };

    ws.onclose = () => {
      console.log("Websocket closed.");
    };

    return () => {
      console.log("I want to close!");
      ws.close();
    };
  }, []);

  return (
    <div className="grid min-h-screen grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
      <div className="col-span-2 row-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Countdown name={"Bedford Park Blvd / Jerome Av"} vehicles={jeromeTimes} routes={routes}></Countdown>
        <Countdown name={"Bedford Park Blvd / Grand Concourse"} vehicles={concourseTimes} routes={routes}></Countdown>
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Alert name={"Service Disruptions"} header={serviceAlerts} routes={routes} />
      </div>
      <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
        <List name={"Paul Av / W 205 St"} vehicles={paulTimes}></List>
        <List name={"W 205 St / Paul Av"} vehicles={w205stTimes}></List>
      </div>
    </div>
  );
}
