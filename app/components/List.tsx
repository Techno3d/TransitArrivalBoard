import React, { ReactNode } from "react";

export interface Vehicle {
  route: string;
  destination: string;
  minutes_until_arrival: number;
  color: string;
}

function Title(props: { name: string }) {
  let name = props.name;
  return <h1 className="mx-2 text-base font-black text-white lg:text-3xl">{name}</h1>;
}

// NOTE: THIS BREAKS IF THERE ARE LESS THAN 3 TRAINS SCHEDULED
export function List(props: { name: string; routes: { [key: string]: { [key: string]: Array<Vehicle> } } }) {
  let name = props.name;
  let routes = props.routes;
  let displays: Array<ReactNode> = [];

  let i = 0;

  Object.values(routes).forEach((destinations) => {
    Object.values(destinations).forEach((vehicles) => {
      displays.push(
        <div className="flex w-full grow flex-row items-center rounded-lg bg-blue-500" key={i}>
          <div className="flex h-full w-4/5 flex-row items-center rounded-lg bg-blue-400 shadow-2xl">
            <div className="flex h-full w-3/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[0].route}</h1>
              <h1 className="mx-2 line-clamp-1 font-bold lg:text-xl">{vehicles[0].destination}</h1>
            </div>
            <div className="flex h-full w-1/4 flex-col items-center justify-center">
              <h1 className="font-black lg:text-6xl">{vehicles[0].minutes_until_arrival}</h1>
              <h1 className="lg:text-xl">min</h1>
            </div>
          </div>
          <div className="flex h-full w-1/4 flex-col items-center justify-center">
            <h1 className="font-black lg:text-6xl">{vehicles[1].minutes_until_arrival}</h1>
            <h1 className="lg:text-xl">min</h1>
          </div>
        </div>,
      );
    });
  });

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">{<Title name={name}></Title>}</div>
      <div className="flex w-full grow flex-col items-center gap-2 text-white">{displays}</div>
    </React.Fragment>
  );
}

/*
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
*/
