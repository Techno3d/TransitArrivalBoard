import { Route } from "@/types/Route";
import { Stop } from "@/types/Stop";
import { Vehicle } from "@/types/Vehicle";
import React from "react";
import { Bullet } from "./Bullet";

export function Bulletin(props: { routes: Record<string, Route>; stop: Stop; walk_time: number }) {
  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">
        <h1 className="mx-2 font-black text-white 2xl:text-3xl">{props.stop.name}</h1>
      </div>
      {props.stop.trips.length > 0 ? (
        Object.values(props.stop.destinations).map((destinations) => {
          return Object.values(destinations).map((vehicles) => {
            let times: Array<Vehicle> = vehicles.filter((vehicle) => {
              return vehicle.minutes_until_arrival > props.walk_time / 2;
            });

            return (
              <div
                className="flex min-h-29 flex-row items-center rounded-lg bg-slate-200 text-black"
                key={Math.random()}
              >
                <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-slate-100 shadow-2xl">
                  <div className="flex h-full w-3/4 flex-row items-center justify-start gap-2 px-2">
                    <Bullet
                      route={
                        props.routes[times[0].route_id]
                          ? props.routes[times[0].route_id]
                          : {
                              route_name: "",
                              route_id: "",
                              route_color: "",
                              route_text_color: "",
                            }
                      }
                      size={72}
                    />
                    <h1 className="line-clamp-2 text-wrap font-bold 2xl:text-3xl">{times[0].destination_name}</h1>
                  </div>
                  <div className="flex h-full w-1/4 flex-col items-center justify-center">
                    <h1 className="font-black 2xl:text-6xl">{times[0].minutes_until_arrival}</h1>
                    <h1 className="font-semibold 2xl:text-2xl">min</h1>
                  </div>
                </div>

                <div className="flex h-full w-1/4 flex-col items-center justify-center">
                  {times[1] ? (
                    <React.Fragment>
                      <h1 className="font-black 2xl:text-6xl">{times[1].minutes_until_arrival}</h1>
                      <h1 className="font-semibold 2xl:text-2xl ">min</h1>
                    </React.Fragment>
                  ) : undefined}
                </div>
              </div>
            );
          });
        })
      ) : (
        <div className="flex grow basis-0 flex-row items-center rounded-lg bg-slate-100">
          <h1 className="flex-1 text-center font-bold text-black 2xl:text-5xl">No scheduled vehicles</h1>
        </div>
      )}
    </React.Fragment>
  );
}
