interface VehicleData {
  route: string;
  destination: string;
  timeUntilArrival: number;
}

interface TitleData {
  name: string;
}

function Title(props: TitleData) {
  let name = props.name;
  return (
    <div className="flex h-[7%] w-full flex-row items-center rounded-xl bg-[#007261]">
      <h1 className="w-full font-black lg:text-3xl">{name}</h1>
    </div>
  );
}

function Vehicle(props: VehicleData) {
  let route = props.route;
  let destination = props.destination;
  let timeUntilArrival = props.timeUntilArrival;
  return (
    <div className="flex h-[20%] w-full flex-row items-center rounded-xl bg-blue-500">
      <div className="flex h-full w-3/4 flex-col items-center justify-center">
        <h1 className="font-black lg:text-7xl">{route}</h1>
        <h1 className="lg:text-2xl">{destination}</h1>
      </div>
      <div className="flex h-full  w-1/4 flex-col items-center justify-center">
        <h1 className="font-black lg:text-7xl">{timeUntilArrival}</h1>
        <h1 className="lg:text-2xl">mins</h1>
      </div>
    </div>
  );
}

const test = [
  { route: "Bx10", destination: "Norwood", timeUntilArrival: 2 },
  { route: "Bx26", destination: "Co-Op City", timeUntilArrival: 10 },
];

export function StationList() {
  return (
    <div className="flex h-full flex-col items-center gap-[1%] p-[1%] text-sm">
      <Title name="Paul Av/W 205 St"></Title>
      {test.map((v: VehicleData, i: number) => (
        <Vehicle key={i} route={v.route} destination={v.destination} timeUntilArrival={v.timeUntilArrival}></Vehicle>
      ))}
    </div>
  );
}
