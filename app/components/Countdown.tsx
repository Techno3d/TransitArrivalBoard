function Title(props: { name: string; direction: string }) {
  let name = props.name;
  let direction = props.direction;
  return (
    <h1 className="mx-2 self-center text-base font-black text-white lg:text-3xl">{`${name} (${direction}-bound)`}</h1>
  );
}

// function Countdown(props: { vehicles: any; walkTime: any }) {}

export default function PlatformCountdown() {
  return (
    <div>
      <div className="flex basis-1/6 flex-row rounded-lg bg-emerald-700">
        {<Title name={"Bedford Pk Blvd / Jerome Av"} direction={"Manhattan"}></Title>}
      </div>
      <div className="flex basis-5/6 flex-row"></div>
    </div>
  );
}
