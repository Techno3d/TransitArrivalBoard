import config from "../../config.json";
import { StatusBar } from "./components/StatusBar";

export function Fallback() {
  return (
    <div className="flex h-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div
        className="min-h-0 grow gap-2 overflow-hidden p-2 text-black"
        style={{ backgroundColor: config.theme.background_color }}
      >
        <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border-black bg-black">
          <h1 className="text-center text-4xl text-balance text-white">
            Ladies and gentlemen, because of an unforseen error, this board is no longer in service. We apologize for
            any inconvenience. <br /> <br /> Please check the MTA website or app for real-time information.
          </h1>
        </div>
      </div>
      <StatusBar credits={config.credits}></StatusBar>
    </div>
  );
}
