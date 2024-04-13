"use client";

import Image from "next/image";
import { useEffect } from "react";
import BulletB from "../public/bullets/B.svg";
import BulletD from "../public/bullets/D.svg";
import Bullet1 from "../public/bullets/_1.svg";
import PlatformCountdown from "./components/Countdown";

export default function Home() {
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

  return (
    <div className="grid min-h-screen grid-flow-dense grid-cols-3 grid-rows-3 gap-4 bg-emerald-700 p-2 text-black">
      <div className="col-span-2 row-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
        <div className="flex w-full basis-1/2 flex-col gap-2">
          <PlatformCountdown></PlatformCountdown>
        </div>
        <div className="flex w-full basis-1/2 flex-col gap-2">
          <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700 px-2">
            <h1 className="text-base font-black text-white lg:text-3xl">
              Bedford Park Blvd / Grand Concourse (Manhattan-bound)
            </h1>
          </div>
          <div className="flex grow flex-row items-center">
            <div className="flex h-full w-full flex-row rounded-lg bg-slate-300">
              <div className="flex h-full w-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
                <div className="h-full w-2/3 rounded-lg bg-slate-100 shadow-2xl">
                  <div className="flex h-full w-full flex-col p-4">
                    <div className="flex w-full basis-2/5 flex-row items-center overflow-hidden px-8">
                      <h1 className="text-clip text-nowrap text-7xl font-bold text-black">Coney Island</h1>
                    </div>
                    <div className="flex basis-3/5 flex-row items-center gap-4 px-4">
                      <div className="aspect-square h-full p-4">
                        <Image className="w-full" src={BulletD} alt={""}></Image>
                      </div>
                      <div className="flex items-baseline">
                        <h1 className="text-9xl font-bold text-black">4</h1>
                        <h1 className="text-5xl font-semibold text-black">min</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-1/3 flex-col px-8 py-4">
                  <div className="flex w-full basis-2/5 flex-row items-center">
                    <div className="aspect-square h-full">
                      <Image className="w-full" src={BulletB} alt={""}></Image>
                    </div>
                  </div>
                  <div className="flex basis-3/5 flex-row items-center gap-4">
                    <div className="flex items-baseline">
                      <h1 className="text-9xl font-bold text-black">11</h1>
                      <h1 className="text-5xl font-semibold text-black">min</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-1/4 flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <div className="aspect-square h-full">
                    <Image className="w-full" src={BulletD} alt={""}></Image>
                  </div>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <div className="flex items-baseline">
                    <h1 className="text-9xl font-bold text-black">17</h1>
                    <h1 className="text-5xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-2 rounded-xl bg-black p-2">
        <div className="flex h-20 flex-row items-center rounded-lg bg-red-600 px-2">
          <h1 className="text-base font-black text-white lg:text-5xl">Service Disruptions</h1>
        </div>
        <div className="flex w-full grow flex-row items-center justify-center rounded-lg bg-slate-100 p-4">
          <h1 className="h-full text-6xl font-bold">
            {"Southbound "}
            <div className="mx-2 inline-flex h-16 flex-row items-center justify-center gap-2">
              <div className="aspect-square h-5/6">
                <Image className="w-full" src={Bullet1} alt={""}></Image>
              </div>
            </div>
            {" trains are moving at slower speeds near 231 St while we address signal malfunction near that station."}
          </h1>
        </div>
      </div>
      <div className="row-span-3 flex flex-col gap-2 rounded-xl bg-black p-2">
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
