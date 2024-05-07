import React from "react";
import { Vehicle } from "../types";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function Countdown(props: {
  name: string;
  vehicles: Array<Vehicle>;
  routes: { [key: string]: { [key: string]: string } };
}) {
  let name = props.name;
  let vehicles = props.vehicles;
  let routes = props.routes;

  if (vehicles.length == 0)
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

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
      <div className="flex h-64 flex-row items-center">
        <div className="flex h-full w-full flex-row rounded-lg bg-slate-300">
          <div className="flex h-full w-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
            <div className="h-full w-2/3 rounded-lg bg-slate-100 shadow-2xl">
              <div className="flex h-full w-full flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <h1 className="line-clamp-1 font-bold text-black 2xl:text-6xl 2xl:leading-normal">
                    {vehicles[0].destination_name}
                  </h1>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <Bullet
                    short_name={vehicles[0].route_name}
                    color={routes[vehicles[0].route_id].route_color}
                    text_color={routes[vehicles[0].route_id].route_text_color}
                    size={112}
                  />
                  <div className="flex items-baseline">
                    <h1 className="font-bold text-black 2xl:text-9xl">{vehicles[0].minutes_until_arrival}</h1>
                    <h1 className="font-semibold text-black 2xl:text-5xl">min</h1>
                  </div>
                </div>
              </div>
            </div>
            {vehicles[1] ? (
              <div className="flex h-full w-1/3 flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <Bullet
                    short_name={vehicles[1].route_name}
                    color={routes[vehicles[1].route_id].route_color}
                    text_color={routes[vehicles[1].route_id].route_text_color}
                    size={96}
                  />
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <div className="flex items-baseline">
                    <h1 className="font-bold text-black 2xl:text-9xl">{vehicles[1].minutes_until_arrival}</h1>
                    <h1 className="font-semibold text-black 2xl:text-5xl">min</h1>
                  </div>
                </div>
              </div>
            ) : undefined}
          </div>
          {vehicles[2] ? (
            <div className="flex h-full w-1/4 flex-col px-8 py-4">
              <div className="flex w-full basis-2/5 flex-row items-center">
                <Bullet
                  short_name={vehicles[2].route_name}
                  color={routes[vehicles[2].route_id].route_color}
                  text_color={routes[vehicles[2].route_id].route_text_color}
                  size={96}
                />
              </div>
              <div className="flex basis-3/5 flex-row items-center gap-4">
                <div className="flex items-baseline">
                  <h1 className="font-bold text-black 2xl:text-9xl">{vehicles[2].minutes_until_arrival}</h1>
                  <h1 className="font-semibold text-black 2xl:text-5xl">min</h1>
                </div>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </React.Fragment>
  );
}
