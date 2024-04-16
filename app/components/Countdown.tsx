import React from "react";
import { Vehicle } from "../types";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function Countdown(props: { name: string; vehicles: Array<Vehicle> }) {
  let name = props.name;
  let vehicles = props.vehicles;

  if (vehicles.length == 0)
    return (
      <React.Fragment>
        <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
        <div className="flex grow flex-row items-center">
          <div className="flex h-full w-full flex-row items-center rounded-lg bg-slate-100">
            <h1 className="w-full p-8 text-center text-8xl font-bold text-black">No trains scheduled</h1>
          </div>
        </div>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
      <div className="flex grow flex-row items-center">
        <div className="flex h-full w-full flex-row rounded-lg bg-slate-300">
          <div className="flex h-full w-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
            <div className="h-full w-2/3 rounded-lg bg-slate-100 shadow-2xl">
              <div className="flex h-full w-full flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-nowrap align-middle text-[64px] font-bold text-black">
                    {vehicles[0].destination}
                  </h1>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <Bullet route={vehicles[0].route} color={vehicles[0].color} size={112} />
                  <div className="flex items-baseline">
                    <h1 className="text-9xl font-bold text-black">{vehicles[0].minutes_until_arrival}</h1>
                    <h1 className="text-5xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            </div>
            {vehicles[1] ? (
              <div className="flex h-full w-1/3 flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <Bullet route={vehicles[1].route} color={vehicles[1].color} size={96} />
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <div className="flex items-baseline">
                    <h1 className="text-9xl font-bold text-black">{vehicles[1].minutes_until_arrival}</h1>
                    <h1 className="text-5xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            ) : undefined}
          </div>
          {vehicles[2] ? (
            <div className="flex h-full w-1/4 flex-col px-8 py-4">
              <div className="flex w-full basis-2/5 flex-row items-center">
                <Bullet route={vehicles[2].route} color={vehicles[2].color} size={96} />
              </div>
              <div className="flex basis-3/5 flex-row items-center gap-4">
                <div className="flex items-baseline">
                  <h1 className="text-9xl font-bold text-black">{vehicles[2].minutes_until_arrival}</h1>
                  <h1 className="text-5xl font-semibold text-black">min</h1>
                </div>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </React.Fragment>
  );
}
