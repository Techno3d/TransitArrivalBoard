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
    <div className="flex h-[7.5%] w-full flex-row items-center rounded-lg bg-emerald-700">
      <h1 className="w-full font-black lg:text-3xl">{name}</h1>
    </div>
  );
}

function Vehicle(props: VehicleData) {
  let route = props.route;
  let destination = props.destination;
  let timeUntilArrival = props.timeUntilArrival;
  return (
    <div className="flex h-[20%] w-full flex-row items-center rounded-lg bg-blue-500">
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

export function StationList(title: TitleData, vehicles: Array<VehicleData>) {
  return (
    <div className="flex h-full flex-col items-center gap-[1%] p-[1%] text-sm">
      <Title name={title.name}></Title>
      {vehicles.map((v: VehicleData, i: number) => (
        <Vehicle key={i} route={v.route} destination={v.destination} timeUntilArrival={v.timeUntilArrival}></Vehicle>
      ))}
    </div>
  );
}
