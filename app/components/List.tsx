import React, { ReactNode } from "react";
import { Vehicle } from "../types";
import { Title } from "./Title";

export function List(props: { name: string; routes: { [key: string]: { [key: string]: Array<Vehicle> } } }) {
  let name = props.name;
  let routes = props.routes;
  let displays: Array<ReactNode> = [];

  let i = 0;

  Object.values(routes).forEach((destinations) => {
    Object.values(destinations).map((vehicles) => {
      displays.push(
        <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500" key={i}>
          <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
            <div className="flex h-full w-3/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[0].route}</h1>
              <h1 className="mx-2 line-clamp-1 font-bold lg:text-xl">{vehicles[0].destination}</h1>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[0].minutes_until_arrival}</h1>
              <h1 className="font-semibold lg:text-xl">min</h1>
            </div>
          </div>
          {vehicles[1] ? (
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[1].minutes_until_arrival}</h1>
              <h1 className="font-semibold lg:text-xl ">min</h1>
            </div>
          ) : undefined}
        </div>,
      );
      i++;
    });
  });

  if (displays.length === 0) {
    return (
      <React.Fragment>
        <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
        <div className="flex grow flex-row items-center">
          <div className="flex h-full w-full flex-row items-center rounded-lg bg-slate-100">
            <h1 className="w-full p-8 text-center text-8xl font-bold text-black">No buses scheduled</h1>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
      <div className="flex w-full grow flex-col items-center gap-2 text-white">{displays}</div>
    </React.Fragment>
  );
}
