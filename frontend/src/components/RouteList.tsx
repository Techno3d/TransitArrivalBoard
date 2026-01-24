import { useContext } from "react";
import { Fragment } from "react/jsx-runtime";
import config from "../../../config.json";
import { SocketContext } from "../context/SocketContext";
import { type Vehicle } from "../types";
import { formatStopName } from "../utils/stop";
import { Bullet } from "./Bullet";

export function RouteList(props: { config: { name: string; stop_ids: Array<string>; walk_time: number } }) {
  const { routes, stops } = useContext(SocketContext);

  const stop = stops[props.config.stop_ids[0]];

  if (!stop) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-xl border-black bg-black p-2">
        <div
          className="flex min-h-16 items-center justify-center rounded-lg"
          style={{ backgroundColor: config.theme.primary_color, color: config.theme.text_color }}
        ></div>
        <div className="flex grow flex-row rounded-lg bg-white"></div>
      </div>
    );
  }

  const times: Array<Vehicle> = stop.trips.filter((vehicle) => {
    return vehicle.minutes_until_arrival > props.config.walk_time / 2;
  });

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-xl border-black bg-black p-2">
      <div
        className="flex min-h-16 items-center justify-center rounded-lg text-4xl font-extrabold"
        style={{ backgroundColor: config.theme.primary_color, color: config.theme.text_color }}
      >
        <h1>{props.config.name ? props.config.name : formatStopName(stop.name)}</h1>
      </div>
      {times.length > 0 ? (
        <div className="flex h-full flex-col gap-2 overflow-hidden bg-black">
          {Object.values(stop.destinations).map((directions) => {
            return Object.values(directions).map((vehicles) => {
              const times: Array<Vehicle> = vehicles.filter((vehicle) => {
                return vehicle.minutes_until_arrival > props.config.walk_time / 2;
              });

              return times.length > 0 ? (
                <div
                  className="flex min-h-24 flex-row items-center rounded-lg bg-slate-200 text-black"
                  key={times[0].route_id + "_" + times[0].destination_id}
                >
                  <div className="flex h-full w-5/6 flex-row items-center rounded-lg bg-slate-100 shadow-2xl">
                    <div className="flex h-full w-4/5 flex-row items-center justify-start gap-4 p-2">
                      <Bullet route={routes[times[0].route_id]} size={64} />
                      <h1 className="line-clamp-2 text-4xl font-bold text-wrap">
                        {formatStopName(times[0].destination_name)}
                      </h1>
                    </div>
                    <div className="flex h-full w-1/5 flex-col items-center justify-center">
                      <h1 className="text-5xl font-extrabold">{times[0].minutes_until_arrival}</h1>
                      <h1 className="text-2xl font-semibold">min</h1>
                    </div>
                  </div>

                  <div className="flex h-full w-1/6 flex-col items-center justify-center">
                    {times[1] ? (
                      <Fragment>
                        <h1 className="text-5xl font-extrabold">{times[1].minutes_until_arrival}</h1>
                        <h1 className="text-2xl font-semibold">min</h1>
                      </Fragment>
                    ) : undefined}
                  </div>
                </div>
              ) : undefined;
            });
          })}
        </div>
      ) : (
        <div className="flex grow items-center justify-center bg-white text-5xl font-semibold text-black">
          <h1 className="text-center">No scheduled vehicles</h1>
        </div>
      )}
    </div>
  );
}
