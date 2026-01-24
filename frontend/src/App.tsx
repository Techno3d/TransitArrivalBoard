import config from "../../config.json";
import { AlertList } from "./components/AlertList";
import { RouteList } from "./components/RouteList";
import { StatusBar } from "./components/StatusBar";
import { VehicleCountdown } from "./components/VehicleCountdown";

export default function App() {
  return (
    <div className="flex h-full w-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div
        className="grid grow grid-flow-dense grid-cols-3 grid-rows-25 gap-2 p-2 text-black"
        style={{ backgroundColor: config.theme.background_color }}
      >
        <div className="col-span-2 row-span-8">
          <VehicleCountdown config={config.subway[0]}></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-8">
          <VehicleCountdown config={config.subway[1]}></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-9">
          <AlertList />
        </div>

        <div className="col-span-1 row-span-25">
          <RouteList config={config.bus[0]}></RouteList>
        </div>
      </div>
      <StatusBar config={config.credits}></StatusBar>
    </div>
  );
}
