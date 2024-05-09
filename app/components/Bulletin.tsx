import React, { ReactNode } from "react";
import { Vehicle } from "../types";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function Bulletin(props: {
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
        <div className="flex h-29 w-full flex-row items-center rounded-lg bg-slate-200 text-black" key={Math.random()}>
          <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-slate-100 shadow-2xl">
            <div className="flex h-full w-3/4 flex-row items-center gap-2 px-2">
              <Bullet
                short_name={vehicles[0].route_name}
                color={routes[vehicles[0].route_id].route_color}
                text_color={routes[vehicles[0].route_id].route_text_color}
                size={72}
              />
              <h1 className="line-clamp-2 text-wrap font-bold 2xl:text-3xl">{vehicles[0].destination_name}</h1>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black 2xl:text-6xl">{vehicles[0].minutes_until_arrival}</h1>
              <h1 className="font-semibold 2xl:text-2xl">min</h1>
            </div>
          </div>

          <div className="flex h-full w-1/4 flex-col items-center justify-center">
            {vehicles[1] ? (
              <React.Fragment>
                <h1 className="font-black 2xl:text-6xl">{vehicles[1].minutes_until_arrival}</h1>
                <h1 className="font-semibold 2xl:text-2xl ">min</h1>
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
            <h1 className="w-full text-center font-bold text-black 2xl:text-5xl">No vehicles scheduled</h1>
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
