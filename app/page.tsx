"use client";

import { Alert } from "./components/Alert";
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
            { route: "4", destination: "Crown Hts-Utica Av", minutes_until_arrival: 4, color: "#00933C" },
            { route: "4", destination: "Utica Av", minutes_until_arrival: 12, color: "#00933C" },
            { route: "4", destination: "Utica Av", minutes_until_arrival: 19, color: "#00933C" },
          ]}
        ></Countdown>
        <Countdown
          name={"Bedford Park Blvd / Grand Concourse"}
          vehicles={[
            { route: "F", destination: "Coney Island-Stillwell Av", minutes_until_arrival: 6, color: "#FF6319" },
            { route: "D", destination: "Coney Island", minutes_until_arrival: 11, color: "#FF6319" },
            { route: "D", destination: "Coney Island", minutes_until_arrival: 23, color: "#FF6319" },
          ]}
        ></Countdown>
      </div>
      <div className="col-span-2 row-span-1 flex flex-col gap-2 rounded-xl bg-black p-2">
        <Alert
          name={"Service Disruptions"}
          header={
            "Northbound [4][5] trains are running with delays after EMS responded to someone in need of medical assistance on a train at 125 St. Take the [6] train at this time."
          }
          routes={{ "4": { color: "#00933C" }, "5": { color: "#00933C" }, "6": { color: "#00933C" } }}
        />
      </div>
      <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
        <List name={"Paul Av / W 205 St"} routes={paul}></List>
        <List name={"W 205 St / Paul Av"} routes={w205st}></List>
      </div>
    </div>
  );
}
