import Image from "next/image";
import React from "react";
import Bullet4 from "../../public/bullets/_4.svg";

function Title(props: { name: string; northbound: boolean }) {
  let name = props.name;
  let northbound = props.northbound;
  return (
    <h1 className="text-base font-black text-white lg:text-3xl">{`${name} (${northbound ? "North" : "South"}bound)`}</h1>
  );
}

// function Countdown(props: { vehicles: any; walkTime: any }) {}

/*
<div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700 px-2">
            <h1 className="text-base font-black text-white lg:text-3xl">
              Bedford Park Blvd / Jerome Av (Manhattan-bound)
            </h1>
          </div>
          <div className="flex grow flex-row items-center">
            <div className="flex h-full w-full flex-row rounded-lg bg-slate-300">
              <div className="flex h-full w-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
                <div className="h-full w-2/3 rounded-lg bg-slate-100 shadow-2xl">
                  <div className="flex h-full w-full flex-col p-4">
                    <div className="flex w-full basis-2/5 flex-row items-center overflow-hidden px-8">
                      <h1 className="text-clip text-nowrap text-7xl font-bold text-black">Utica Av</h1>
                    </div>
                    <div className="flex basis-3/5 flex-row items-center gap-4 px-4">
                      <div className="aspect-square h-full p-4">
                        <Image className="w-full" src={Bullet4} alt={""}></Image>
                      </div>
                      <div className="flex items-baseline">
                        <h1 className="text-9xl font-bold text-black">7</h1>
                        <h1 className="text-5xl font-semibold text-black">min</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-full w-1/3 flex-col px-8 py-4">
                  <div className="flex w-full basis-2/5 flex-row items-center">
                    <div className="aspect-square h-full">
                      <Image className="w-full" src={Bullet4} alt={""}></Image>
                    </div>
                  </div>
                  <div className="flex basis-3/5 flex-row items-center gap-4">
                    <div className="flex items-baseline">
                      <h1 className="text-9xl font-bold text-black">12</h1>
                      <h1 className="text-5xl font-semibold text-black">min</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-1/4 flex-col px-8 py-4">
                <div className="flex w-full basis-2/5 flex-row items-center">
                  <div className="aspect-square h-full">
                    <Image className="w-full" src={Bullet4} alt={""}></Image>
                  </div>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4">
                  <div className="flex items-baseline">
                    <h1 className="text-9xl font-bold text-black">14</h1>
                    <h1 className="text-5xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>*/

export default function PlatformCountdown() {
  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700 px-2">
        {<Title name={"Bedford Pk Blvd / Jerome Av"} northbound={false}></Title>}
      </div>
      <div className="flex grow flex-row items-center">
        <div className="flex h-full w-full flex-row rounded-lg bg-slate-300">
          <div className="flex h-full w-3/4 flex-row rounded-lg bg-slate-200 shadow-2xl">
            <div className="h-full w-2/3 rounded-lg bg-slate-100 shadow-2xl">
              <div className="flex h-full w-full flex-col p-4">
                <div className="flex w-full basis-2/5 flex-row items-center overflow-hidden px-8">
                  <h1 className="text-clip text-nowrap text-7xl font-bold text-black">Utica Av</h1>
                </div>
                <div className="flex basis-3/5 flex-row items-center gap-4 px-4">
                  <div className="aspect-square h-full p-4">
                    <Image className="w-full" src={Bullet4} alt={""}></Image>
                  </div>
                  <div className="flex items-baseline">
                    <h1 className="text-9xl font-bold text-black">7</h1>
                    <h1 className="text-5xl font-semibold text-black">min</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full w-1/3 flex-col px-8 py-4">
              <div className="flex w-full basis-2/5 flex-row items-center">
                <div className="aspect-square h-full">
                  <Image className="w-full" src={Bullet4} alt={""}></Image>
                </div>
              </div>
              <div className="flex basis-3/5 flex-row items-center gap-4">
                <div className="flex items-baseline">
                  <h1 className="text-9xl font-bold text-black">12</h1>
                  <h1 className="text-5xl font-semibold text-black">min</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-1/4 flex-col px-8 py-4">
            <div className="flex w-full basis-2/5 flex-row items-center">
              <div className="aspect-square h-full">
                <Image className="w-full" src={Bullet4} alt={""}></Image>
              </div>
            </div>
            <div className="flex basis-3/5 flex-row items-center gap-4">
              <div className="flex items-baseline">
                <h1 className="text-9xl font-bold text-black">14</h1>
                <h1 className="text-5xl font-semibold text-black">min</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
