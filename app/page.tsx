"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bulletin } from "./components/Bulletin";
import { Countdown } from "./components/Countdown";
import { Message } from "./components/Message";
import { config } from "./config";
import { Alert, Info } from "./types";

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState(false);
  const [info, setInfo] = useState<Info>({ stops_realtime: {}, service_alerts_realtime: [], routes_static: {} });
  const [serviceAlerts, setServiceAlerts] = useState<Array<string>>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9001");

    ws.onopen = () => {
      setStatus(true);
      console.log("Websocket opened.");

      ws.send(JSON.stringify(config));
    };

    ws.onmessage = (event) => {
      setStatus(true);
      console.log("Message recieved.");

      const message = JSON.parse(event.data);
      setInfo(message);

      const headers: Array<string> = [];
      const serviceData: Array<Alert> = message.service_alerts_realtime;
      serviceData
        .slice()
        .reverse()
        .forEach((alert) => {
          if (headers.indexOf(alert.header_text) !== -1) return;
          if (alert.sort_order < 22) return;
          headers.push(alert.header_text);
        });
      setServiceAlerts(headers);
      if (headers.length > 0) {
        setIndex((i) => ((i % headers.length) + headers.length) % headers.length);
      } else {
        setIndex(0);
      }
    };

    ws.onclose = () => {
      setStatus(false);
      console.log("Websocket closed.");
    };

    return () => {
      setStatus(false);
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

      if (serviceAlerts.length > 0) {
        setIndex((i) => (((i + 1) % serviceAlerts.length) + serviceAlerts.length) % serviceAlerts.length);
      } else {
        setIndex(0);
      }
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [serviceAlerts.length]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid grow grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
        <div className="col-span-2 row-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
          <Countdown
            name={info.stops_realtime["405S"] ? info.stops_realtime["405S"].name : ""}
            vehicles={info.stops_realtime["405S"] ? info.stops_realtime["405S"].trips : []}
            routes={info.routes_static}
          ></Countdown>
          <Countdown
            name={info.stops_realtime["D03S"] ? info.stops_realtime["D03S"].name : ""}
            vehicles={info.stops_realtime["D03S"] ? info.stops_realtime["D03S"].trips : []}
            routes={info.routes_static}
          ></Countdown>
        </div>
        <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-xl bg-black p-2">
          <Message name={"Service Alerts"} headers={serviceAlerts} routes={info.routes_static} index={index} />
        </div>
        <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
          <Bulletin
            name={info.stops_realtime["100017"] ? info.stops_realtime["100017"].name : ""}
            vehicles={info.stops_realtime["100017"] ? info.stops_realtime["100017"].routes : {}}
            routes={info.routes_static}
          ></Bulletin>
          <Bulletin
            name={info.stops_realtime["100723"] ? info.stops_realtime["100723"].name : ""}
            vehicles={info.stops_realtime["100723"] ? info.stops_realtime["100723"].routes : {}}
            routes={info.routes_static}
          ></Bulletin>
        </div>
      </div>
      <div className="flex h-14 flex-row items-center rounded-lg bg-black">
        <h1 className="mx-2 flex-1 grow text-start font-bold text-white 2xl:text-3xl">
          {"Status: "}
          {status ? (
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
