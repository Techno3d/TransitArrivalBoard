import config from "../../config.json";
import { AlertList } from "./components/AlertList";
import { RouteList } from "./components/RouteList";
import { StatusBar } from "./components/StatusBar";
import { VehicleCountdown } from "./components/VehicleCountdown";

export default function App() {
  return (
    <div className="flex h-full w-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div className="grid grow grid-flow-dense grid-cols-3 grid-rows-3 gap-2 bg-emerald-800 p-2 text-black">
        <div className="col-span-2 row-span-1">
          <VehicleCountdown
            name={config.subway[0].name}
            name_text_color={config.theme.text_color}
            name_background_color={config.theme.primary_color}
            stop_id={config.subway[0].stop_ids[0]}
            walk_time={config.subway[0].walk_time}
          ></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-1">
          <VehicleCountdown
            name={config.subway[1].name}
            name_text_color={config.theme.text_color}
            name_background_color={config.theme.primary_color}
            stop_id={config.subway[1].stop_ids[0]}
            walk_time={config.subway[1].walk_time}
          ></VehicleCountdown>
        </div>

        <div className="col-span-2 row-span-1">
          <AlertList name={"Service Alerts"} name_text_color={"#FFFFFF"} name_background_color={"#9f0712"} />
        </div>

        <div className="col-span-1 row-span-3">
          <RouteList
            name={config.bus[0].name}
            name_text_color={config.theme.text_color}
            name_background_color={config.theme.primary_color}
            stop_id={config.bus[0].stop_ids[0]}
            walk_time={config.bus[0].walk_time}
          ></RouteList>
        </div>
      </div>
      <StatusBar maintainers={config.maintainers}></StatusBar>
    </div>
  );
}
