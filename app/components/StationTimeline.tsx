import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import Bullet4 from "../../public/subway/4.svg";
import BulletB from "../../public/subway/B.svg";
import BulletD from "../../public/subway/D.svg";

interface VehicleData {
  timeUntilArrival: number;
  maxTime: number;
}

interface RouteData {
  children?: ReactNode;
  route: string;
  bullet: StaticImageData;
  maxTime: number;
}

interface TitleData {
  name: string;
  direction: string;
}

function Title(props: TitleData) {
  let name = props.name;
  let direction = props.direction;
  return (
    <div className="flex h-[7%] w-full flex-row items-center rounded-xl bg-[#007261]">
      <h1 className="w-full font-black lg:text-3xl">{name + " (" + direction + "-bound)"}</h1>
    </div>
  );
}

function Route(props: RouteData) {
  let route = props.route;
  let bullet = props.bullet;
  //let maxTime = props.maxTime;

  return (
    <div className="flex h-[30%] w-full flex-row items-center">
      <div className="aspect-square h-full">
        <Image className="h-full w-full" src={bullet} alt={route}></Image>
      </div>
      <span className={`flex h-1/6 w-5/6 flex-row items-center rounded-full ${routeColors[route]}`}>
        {props.children}
      </span>
    </div>
  );
}

function Vehicle(props: VehicleData) {
  let timeUntilArrival = props.timeUntilArrival;
  let maxTime = props.maxTime;
  let percentage = (100 * timeUntilArrival) / maxTime;
  percentage *= 0.75;
  percentage += 12.5;
  percentage -= 8.75;
  return (
    <div
      className={`relative flex aspect-square w-[17.5%] origin-center flex-col items-center justify-center rounded-[48px] border-8 border-black bg-slate-50 object-center text-black`}
      style={{ left: percentage + "%" }}
    >
      <h1 className="lg:text-8xl">{timeUntilArrival}</h1>
      <h1 className="lg:text-2xl">mins</h1>
    </div>
  );
}

const routeColors: { [key: string]: string } = {
  "4": "bg-[#00933c]",
  B: "bg-[#ff6319]",
  D: "bg-[#ff6319]",
};

const test: Array<RouteData> = [
  {
    route: "4",
    bullet: Bullet4,
    maxTime: 20,
  },
  {
    route: "B",
    bullet: BulletB,
    maxTime: 20,
  },
  {
    route: "D",
    bullet: BulletD,
    maxTime: 20,
  },
];

export function StationTimeline() {
  return (
    <div className="flex h-full flex-col items-center gap-[1%] p-[1%]">
      <Title name="Bedford Pk Blvd" direction="Manhattan"></Title>
      {test.map((v: RouteData, i: number) => (
        <Route key={i} route={v.route} bullet={v.bullet} maxTime={v.maxTime}>
          <Vehicle timeUntilArrival={20} maxTime={v.maxTime}></Vehicle>
        </Route>
      ))}
    </div>
  );
}
