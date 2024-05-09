import React from "react";
import { Vehicle } from "../types";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function List(props: {
  name: string;
  vehicles: Array<Vehicle>;
  max: number;
  routes: { [key: string]: { [key: string]: string } };
}) {
  let name = props.name;
  let max = props.max;
  let vehicles = props.vehicles.slice(0, max);
  let routes = props.routes;

  if (vehicles.length == 0) {
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
      {vehicles.map((vehicle) => {
        return (
          <div className="flex h-29 flex-row items-center rounded-lg bg-slate-100 text-black" key={Math.random()}>
            <div className="flex h-full w-3/4 flex-row items-center gap-2 px-2">
              <Bullet
                short_name={vehicle.route_name}
                color={routes[vehicle.route_id].route_color}
                text_color={routes[vehicle.route_id].route_text_color}
                size={72}
              />
              <h1 className="line-clamp-1 text-wrap font-bold 2xl:text-4xl">{vehicle.destination_name}</h1>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black 2xl:text-6xl">{vehicle.minutes_until_arrival}</h1>
              <h1 className="font-semibold 2xl:text-2xl">min</h1>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}
