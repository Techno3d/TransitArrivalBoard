"use client";

import { Bullet } from "./components/Bullet";
import { Countdown } from "./components/Countdown";

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
          <h1 className="line-clamp-4 text-5xl font-bold leading-[1.275]">
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
      </div>
      <div className="col-span-1 row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
        <div className="flex h-14 w-full flex-row items-center rounded-lg bg-emerald-700 px-2">
          <h1 className="text-base font-black text-white lg:text-3xl">Paul Av / W 205 St</h1>
        </div>
        <div className="flex w-full grow flex-col items-center gap-2 text-white">
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx10</h1>
                <h1 className="lg:text-3xl">Norwood</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">5</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">7</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx10</h1>
                <h1 className="lg:text-3xl">Riverdale</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">9</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">20</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx28</h1>
                <h1 className="lg:text-3xl">Fordham</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">13</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">27</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx28</h1>
                <h1 className="lg:text-3xl">Co-op City</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">3</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">8</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
        </div>
        <div className="flex h-14 w-full flex-row items-center rounded-lg bg-emerald-700 px-2">
          <h1 className="text-base font-black text-white lg:text-3xl">W 205 St / Paul Av</h1>
        </div>
        <div className="flex w-full grow flex-col items-center gap-2 text-white">
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx22</h1>
                <h1 className="lg:text-3xl">Castle Hill</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">6</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">23</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx25</h1>
                <h1 className="lg:text-3xl">Co-op City</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">2</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">31</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
          <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500">
            <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
              <div className="flex h-full w-3/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">Bx26</h1>
                <h1 className="lg:text-3xl">Co-op City</h1>
              </div>
              <div className="flex h-full w-1/4 flex-col items-center justify-center">
                <h1 className="font-black lg:text-7xl">11</h1>
                <h1 className="lg:text-3xl">min</h1>
              </div>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-7xl">15</h1>
              <h1 className="lg:text-3xl">min</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
