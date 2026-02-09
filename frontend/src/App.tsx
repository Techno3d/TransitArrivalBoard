import config from "../../config.json";
import { AlertList } from "./components/AlertList";
import { RouteList } from "./components/RouteList";
import { StatusBar } from "./components/StatusBar";
import { VehicleCountdown } from "./components/VehicleCountdown";

export default function App() {
  return (
    <div className="flex h-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div
        className="grid min-h-0 grow grid-flow-dense grid-cols-3 grid-rows-3 gap-2 overflow-hidden p-2 text-black"
        style={{ backgroundColor: config.theme.background_color }}
      >
        <div className="col-span-2 row-span-3 flex flex-col gap-2 overflow-hidden">
          {config.subway.map((subway) => (
            <VehicleCountdown
              key={subway.stop_ids[0]}
              name={subway.name}
              name_text_color={config.theme.text_color}
              name_background_color={config.theme.primary_color}
              stop_id={subway.stop_ids[0]}
              walk_time={subway.walk_time}
            ></VehicleCountdown>
          ))}
          <AlertList name={"Service Alerts"} name_text_color={"#FFFFFF"} name_background_color={"#9f0712"} />
        </div>

        <div className="col-span-1 row-span-3 flex flex-col gap-2 overflow-hidden">
          {config.bus.map((stop) => (
            <RouteList
              key={stop.stop_ids[0]}
              name={stop.name}
              name_text_color={config.theme.text_color}
              name_background_color={config.theme.primary_color}
              stop_id={stop.stop_ids[0]}
              walk_time={stop.walk_time}
            ></RouteList>
          ))}
        </div>
      </div>
      <StatusBar credits={config.credits}></StatusBar>
    </div>
  );
}
