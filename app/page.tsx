"use client";

import Image from "next/image";
import { Bullet } from "./components/Bullet";
import { Countdown } from "./components/Countdown";
import { List } from "./components/List";

export default function Home() {
  /*
  const ws = new WebSocket("ws://0.0.0.0:9001");
  ws.addEventListener("open", () => {
    ws.send(`{
        "subway": [
            {
                "stop_ids": ["405S"],
                "walk_time": 10
            },
            {
                "stop_ids": ["D03S"],
                "walk_time": 14
            }
        ],
        "bus": [
            {
                "stop_ids": ["100017", "103400"],
                "walk_time": 3
            },
            {
                "stop_ids": ["100723"],
                "walk_time": 3
            }
        ],
        "service_alerts": {
            "severity_limit": 12          
        }
    }`);
  });
  ws.addEventListener("message", (event) => {
    console.log(event.data);
  });

  useEffect(() => {
    const ws = new WebSocket("ws://0.0.0.0:9001");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
    };

    return () => {
      ws.close();
    };
  });
  */
  let paul = {
    Bx10: {
      Norwood: [
        { color: "#ffffff", route: "Bx10", minutes_until_arrival: 5, destination: "NORWOOD 205 ST STA" },
        { color: "#ffffff", route: "Bx10", minutes_until_arrival: 7, destination: "NORWOOD 205 ST STA" },
      ],
      Riverdale: [
        { color: "#ffffff", route: "Bx10", minutes_until_arrival: 9, destination: "RIVERDALE 263 ST" },
        { color: "#ffffff", route: "Bx10", minutes_until_arrival: 20, destination: "RIVERDALE 263 ST" },
      ],
    },
    Bx28: {
      Fordham: [
        { color: "#ffffff", route: "Bx28", minutes_until_arrival: 1, destination: "FORDHAM CENTER 192 ST" },
        { color: "#ffffff", route: "Bx28", minutes_until_arrival: 14, destination: "FORDHAM CENTER 192 ST" },
      ],
      "Co-op City": [
        {
          color: "#ffffff",
          route: "Bx28",
          minutes_until_arrival: 3,
          destination: "CO-OP CITY EARHART LANE",
        },
        { color: "#ffffff", route: "Bx28", minutes_until_arrival: 8, destination: "CO-OP CITY EARHART LANE" },
      ],
    },
  };

  let w205st = {
    Bx22: {
      Norwood: [
        { color: "#ffffff", route: "Bx22", minutes_until_arrival: 6, destination: "CASTLE HILL ZEREGA AV" },
        { color: "#ffffff", route: "Bx22", minutes_until_arrival: 23, destination: "CASTLE HILL ZEREGA AV" },
      ],
    },
    Bx25: {
      Norwood: [
        {
          color: "#ffffff",
          route: "Bx25",
          minutes_until_arrival: 2,
          destination: "CO-OP CITY BAY PLAZA",
        },
        { color: "#ffffff", route: "Bx25", minutes_until_arrival: 31, destination: "CO-OP CITY BAY PLAZA" },
      ],
    },
    Bx26: {
      Norwood: [
        { color: "#ffffff", route: "Bx26", minutes_until_arrival: 11, destination: "CO-OP CITY EARHART LANE" },
        { color: "#ffffff", route: "Bx26", minutes_until_arrival: 15, destination: "CO-OP CITY EARHART LANE" },
      ],
    },
  };

  return (
    <div className="grid min-h-screen grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
      <div className="col-span-2 row-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Countdown
          name={"Bedford Park Blvd / Jerome Av"}
          vehicles={[
            { route: "6", destination: "Brooklyn Bridge", minutes_until_arrival: 4, color: "#00933C" },
            { route: "4", destination: "Utica Av", minutes_until_arrival: 12, color: "#00933C" },
            { route: "4", destination: "Bowling Green", minutes_until_arrival: 19, color: "#00933C" },
          ]}
        ></Countdown>
        <Countdown
          name={"Bedford Park Blvd / Grand Concourse"}
          vehicles={[
            { route: "F", destination: "Kings Hwy", minutes_until_arrival: 6, color: "#FF6319" },
            { route: "D", destination: "Coney Island", minutes_until_arrival: 11, color: "#FF6319" },
            { route: "D", destination: "Coney Island", minutes_until_arrival: 23, color: "#FF6319" },
          ]}
        ></Countdown>
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-xl bg-black p-2">
        <div className="flex h-14 flex-row items-center rounded-lg bg-red-600">
          <h1 className="mx-2 text-base font-black text-white lg:text-4xl">Service Disruptions</h1>
        </div>
        <div className="flex w-full grow flex-row rounded-lg bg-slate-100 p-2">
          <h1 className="line-clamp-3 text-5xl font-bold leading-[1.275]">
            <div className="mx-1 inline-flex">
              <Bullet route={"1"} color={"#EE352E"} size={48} />
            </div>
            <div className="mx-1 inline-flex">
              <Bullet route={"2"} color={"#EE352E"} size={48} />
            </div>
            <div className="mx-1 inline-flex">
              <Bullet route={"3"} color={"#EE352E"} size={48} />
            </div>
            {" trains are suspended in both directions while we address a derailment near 96 St."}
          </h1>
        </div>
        <div className="flex h-14 flex-row items-center rounded-lg bg-slate-800">
          <h1 className="mx-2 text-base font-bold text-white lg:text-3xl">
            {"Made with ❤️ by "}
            <span className="inline-flex items-baseline">
              <Image
                src="https://cdn.discordapp.com/icons/1031746725817368676/ac3bfe2c8dd9b89729974f3c5888f99c"
                alt=""
                className="mx-1 self-center rounded-full"
                height={32}
                width={32}
              />
              <span>Transit Club</span>
            </span>
            {" ("}
            <span className="inline-flex items-baseline">
              <Image
                src="https://avatars.githubusercontent.com/u/76977073?"
                alt=""
                className="mx-1 self-center rounded-full"
                height={32}
                width={32}
              />
              <span>Shadman</span>
              {", "}
            </span>
            <span className="inline-flex items-baseline">
              <Image
                src="https://avatars.githubusercontent.com/u/95447323?"
                alt=""
                className="mx-1 self-center rounded-full"
                height={32}
                width={32}
              />
              <span>David</span>
            </span>
            {")"}
          </h1>
        </div>
      </div>
      <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
        <List name={"Paul Av / W 205 St"} routes={paul}></List>
        <List name={"W 205 St / Paul Av"} routes={w205st}></List>
      </div>
    </div>
  );
}
