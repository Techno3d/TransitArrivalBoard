import config from "../../config.json";
import { MessageList } from "./components/MessageList";
import { RouteList } from "./components/RouteList";
import { StatusBar } from "./components/StatusBar";
import { VehicleCountdown } from "./components/VehicleCountdown";

export default function App() {
  return (
    <div className="flex h-full w-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div className="grid grow grid-flow-dense grid-cols-3 grid-rows-25 gap-2 bg-emerald-800 p-2 text-black">
        <div className="col-span-2 row-span-8">
          <VehicleCountdown config={config.subway[0]}></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-8">
          <VehicleCountdown config={config.subway[1]}></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-9">
          <MessageList name={"Service Alerts"} />
        </div>

        <div className="col-span-1 row-span-25">
          <RouteList config={config.bus[0]}></RouteList>
        </div>
      </div>
      <StatusBar
        maintainers={[
          { name: "Shadman Syed", github_id: 76977073 },
          { name: "David Wang", github_id: 95447323 },
        ]}
      ></StatusBar>
    </div>
  );
}
