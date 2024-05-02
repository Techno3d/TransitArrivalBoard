import React, { ReactNode } from "react";
import { Vehicle } from "../types";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function List(props: {
  name: string;
  vehicles: { [key: string]: { [key: string]: Array<Vehicle> } };
  routes: { [key: string]: { [key: string]: string } };
}) {
  let name = props.name;
  let trips = props.vehicles;
  let routes = props.routes;
  let displays: Array<ReactNode> = [];

  Object.values(trips).forEach((destinations) => {
    Object.values(destinations).forEach((vehicles) => {
      displays.push(
        <div
          className="flex w-full grow basis-0 flex-row items-center rounded-lg bg-slate-200 text-black"
          key={Math.random()}
        >
          <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-slate-100 shadow-2xl">
            <div className="flex h-full w-3/4 flex-col items-center justify-center">
              <Bullet route={vehicles[0].route_name} color={routes[vehicles[0].route_id].route_color} size={60} />
              <h1 className="mx-2 line-clamp-1 text-center font-bold lg:text-2xl">{vehicles[0].destination_name}</h1>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[0].minutes_until_arrival}</h1>
              <h1 className="font-semibold lg:text-2xl">min</h1>
            </div>
          </div>

          <div className="flex h-full w-1/4 flex-col items-center justify-center">
            {vehicles[1] ? (
              <React.Fragment>
                <h1 className="font-black lg:text-6xl">{vehicles[1].minutes_until_arrival}</h1>
                <h1 className="font-semibold lg:text-2xl ">min</h1>
              </React.Fragment>
            ) : undefined}
          </div>
        </div>,
      );
    });
  });

  if (displays.length === 0) {
    return (
      <React.Fragment>
        <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
        <div className="flex grow flex-row items-center">
          <div className="flex h-full w-full flex-row items-center rounded-lg bg-slate-100">
            <h1 className="w-full p-8 text-center text-8xl font-bold text-black">No vehicles scheduled</h1>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
      {displays}
    </React.Fragment>
  );
}
