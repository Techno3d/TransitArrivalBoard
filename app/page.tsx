"use client";

import { config } from "@/config";
import { Export } from "@/types/Export";
import { Import } from "@/types/Import";
import { Route } from "@/types/Route";
import { Stop } from "@/types/Stop";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bulletin } from "./components/Bulletin";
import { Countdown } from "./components/Countdown";
import { Message } from "./components/Message";

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [websocket, setWebsocket] = useState<boolean>(false);
  const [stops, setStops] = useState<Record<string, Stop>>({});
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [headers, setHeaders] = useState<Array<string>>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:9001");

    ws.onopen = () => {
      console.log("Websocket opened.");
      setWebsocket(true);

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
      setWebsocket(true);

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
      headers.length > 0 ? setIndex((i) => ((i % headers.length) + headers.length) % headers.length) : setIndex(0);
    };

    ws.onerror = () => {
      console.log("Websocket errored.");
      setWebsocket(false);

      ws.close();
    };

    ws.onclose = () => {
      console.log("Websocket closed.");
      setWebsocket(false);

      ws.close();
    };

    return () => {
      console.log("Closing old websocket...");
      setWebsocket(false);

      ws.close();
    };
  }, []);

  useEffect(() => {
    const loop = setInterval(() => {
      const date = new Date();
      setTime(
        date.toLocaleString("en-US", {
          hour12: true,
          timeZone: "America/New_York",
          timeStyle: "short",
          dateStyle: "long",
        }),
      );

      headers.length > 0
        ? setIndex((i) => (((i + 1) % headers.length) + headers.length) % headers.length)
        : setIndex(0);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [headers.length]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex grow flex-row gap-4 bg-emerald-700 p-2 text-black">
        <div className="flex min-h-full basis-2/3 flex-col gap-4">
          <div className="flex h-full flex-col gap-2 rounded-xl bg-black p-2">
            {Object.values(config.subway).map((value) => {
              return (
                <Countdown
                  key={Math.random()}
                  stop={stops[value.stop_ids[0]] ? stops[value.stop_ids[0]] : { name: "", trips: [], destinations: {} }}
                  walk_time={value.walk_time}
                  routes={routes}
                ></Countdown>
              );
            })}
          </div>
          <div className="flex h-full flex-col gap-2 rounded-xl bg-black p-2">
            {<Message name={"Service Alerts"} headers={headers} routes={routes} index={index} />}
          </div>
        </div>
        <div className="flex min-h-full basis-1/3 flex-col gap-4">
          <div className="flex h-full flex-col gap-2 rounded-xl bg-black p-2">
            {Object.values(config.bus).map((value) => {
              return (
                <Bulletin
                  key={Math.random()}
                  stop={stops[value.stop_ids[0]] ? stops[value.stop_ids[0]] : { name: "", trips: [], destinations: {} }}
                  routes={routes}
                  walk_time={value.walk_time}
                ></Bulletin>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex min-h-14 flex-row items-center bg-black">
        <h1 className="mx-2 flex-1 text-start font-bold text-white 2xl:text-3xl">
          {"Status: "}
          {websocket ? (
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
        <h1 className="mx-2 flex-1  text-end font-bold text-white 2xl:text-3xl">{time}</h1>
      </div>
    </div>
  );
}
