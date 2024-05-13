"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert } from "./components/Alert";
import { Countdown } from "./components/Countdown";
import { List } from "./components/List";
import { Vehicle } from "./types";

export default function Home() {
  const [time, setTime] = useState<string>("");
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
  const [wsStatus, setWsStatus] = useState(false);

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
      setWsStatus(true);
      console.log("Message recieved.");

      const message = JSON.parse(event.data);

      const jeromeName: string = message["stops_realtime"]["405S"]["name"];
      setJeromeNames(jeromeName);

      const jeromeData: Vehicle[] = message["stops_realtime"]["405S"]["trips"];
      setJeromeTimes(jeromeData);

      const concouseName: string = message["stops_realtime"]["D03S"]["name"];
      setConcourseNames(concouseName);

      const concourseData: Vehicle[] = message["stops_realtime"]["D03S"]["trips"];
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

      const paulName: string = message["stops_realtime"]["100017"]["name"];
      setPaulNames(paulName);

      const paulData: { [key: string]: { [key: string]: Array<Vehicle> } } =
        message["stops_realtime"]["100017"]["routes"];
      setPaulTimes(paulData);

      const w205Name: string = message["stops_realtime"]["100723"]["name"];
      setW205Names(w205Name);

      const w205stData: { [key: string]: { [key: string]: Array<Vehicle> } } =
        message["stops_realtime"]["100723"]["routes"];
      setW205Times(w205stData);
    };

    ws.onclose = () => {
      setWsStatus(false);
      console.log("Websocket closed.");
    };

    return () => {
      console.log("Closing old websocket...");
      ws.close();
    };
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      if (serviceAlerts.length == 0) {
        setIndex(0);
        return;
      }
      setIndex((i) => (((i + 1) % serviceAlerts.length) + serviceAlerts.length) % serviceAlerts.length);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [serviceAlerts.length]);

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setTime(
        date.toLocaleString("en-US", {
          hour12: true,
          timeZone: "America/New_York",
          timeStyle: "short",
          dateStyle: "long",
        }),
      );
    }, 1000);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid grow grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
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
      <div className="flex h-14 flex-row items-center rounded-lg bg-black">
        <h1 className="mx-2 flex-1 grow text-start font-bold text-white 2xl:text-3xl">
          {"Status: "}
          {wsStatus ? (
            <span className="inline-flex items-baseline rounded-md bg-green-600 px-2">OK</span>
          ) : (
            <span className="inline-flex items-baseline rounded-md bg-red-600 px-2">ERROR</span>
          )}
        </h1>
        <h1 className="mx-2 text-center font-bold text-white 2xl:text-3xl">
          {"Made with ❤️ by "}
          <span className="inline-flex items-baseline">
            <Image
              src="https://avatars.githubusercontent.com/u/76977073?"
              alt=""
              className="mx-1 self-center rounded-full"
              height={36}
              width={36}
            />
            <span>Shadman Syed</span>
          </span>
          {" and "}
          <span className="inline-flex items-baseline">
            <Image
              src="https://avatars.githubusercontent.com/u/95447323?"
              alt=""
              className="mx-1 self-center rounded-full"
              height={36}
              width={36}
            />
            <span>David Wang</span>
          </span>
        </h1>

        <h1 className="mx-2 flex-1 grow text-end font-bold text-white 2xl:text-3xl">{time}</h1>
      </div>
    </div>
  );
}
