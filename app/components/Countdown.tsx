import { Route } from "@/types/Route";
import { Stop } from "@/types/Stop";
import { Vehicle } from "@/types/Vehicle";
import { Fragment } from "react/jsx-runtime";
import { formatStopName } from "../lib/stop";
import { Bullet } from "./Bullet";

export function Countdown(props: { routes: Record<string, Route>; stop: Stop; walk_time: number }) {
  if (!props.stop) {
    return (
      <div className="flex h-full w-full flex-col gap-2 rounded-xl border-black bg-black p-2">
        <div className="flex min-h-16 items-center justify-center rounded-lg bg-emerald-800"></div>
        <div className="flex grow flex-row rounded-lg bg-white"></div>
      </div>
    );
  }

  const times: Array<Vehicle> = props.stop.trips.filter((vehicle) => {
    return vehicle.minutes_until_arrival > props.walk_time / 2;
  });

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-xl border-black bg-black p-2">
      <div className="flex min-h-16 items-center justify-center rounded-lg bg-emerald-800 text-4xl font-extrabold text-white">
        <h1>{formatStopName(props.stop.name)}</h1>
      </div>
      {times.length > 0 ? (
        <div className="flex grow flex-row rounded-lg bg-slate-300">
          <div className="flex grow basis-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
            <div className="flex grow basis-2/3 rounded-lg bg-slate-100 shadow-2xl">
              <div className="flex grow flex-col px-6 py-2">
                <div className="flex basis-2/5 flex-row items-center">
                  <h1 className="line-clamp-1 text-5xl leading-normal font-bold text-black">
                    {formatStopName(times[0].destination_name)}
                  </h1>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <Bullet route={props.routes[times[0].route_id]} size={96} />
                  <div className="flex items-baseline">
                    <h1 className="text-8xl font-bold text-black">{times[0].minutes_until_arrival}</h1>
                    <h1 className="text-4xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex grow basis-1/3 flex-col px-6 py-2">
              {times[1] ? (
                <Fragment>
                  <div className="flex basis-2/5 flex-row items-center">
                    <Bullet route={props.routes[times[1].route_id]} size={72} />
                  </div>
                  <div className="flex basis-3/5 flex-row items-center gap-4">
                    <div className="flex items-baseline">
                      <h1 className="text-8xl font-bold text-black">{times[1].minutes_until_arrival}</h1>
                      <h1 className="text-4xl font-semibold text-black">min</h1>
                    </div>
                  </div>
                </Fragment>
              ) : undefined}
            </div>
          </div>
          <div className="flex grow basis-1/4 flex-col px-6 py-2">
            {times[2] ? (
              <Fragment>
                <div className="flex basis-2/5 flex-row items-center">
                  <Bullet route={props.routes[times[2].route_id]} size={72} />
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <div className="flex items-baseline">
                    <h1 className="text-8xl font-bold text-black">{times[2].minutes_until_arrival}</h1>
                    <h1 className="text-4xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </Fragment>
            ) : undefined}
          </div>
        </div>
      ) : (
        <div className="flex grow items-center justify-center bg-white text-5xl font-semibold text-black">
          <h1 className="">No scheduled vehicles</h1>
        </div>
      )}
    </div>
  );
}
