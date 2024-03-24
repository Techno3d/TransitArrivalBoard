import { StationList } from "./components/StationList";
import { StationTimeline } from "./components/StationTimeline";

export default function Home() {
  return (
    <main className="min-w-screen flex min-h-screen flex-col items-center gap-[2vh] bg-[#007261] p-[2vh] text-center text-base text-white">
      <span className="flex h-[60vh] w-full flex-row items-center gap-[2vh]">
        <div className=" h-full w-2/3 rounded-lg bg-slate-50 font-mono text-sm">
          <StationTimeline></StationTimeline>
        </div>
        <div className=" h-full w-1/3 rounded-2xl bg-slate-50 font-mono text-sm">
          <StationList></StationList>
        </div>
      </span>
      <span className=" flex h-[25vh] w-full items-center rounded-lg bg-slate-50 font-mono text-sm">HI</span>
      <div className="flex h-[4vh] flex-row items-center self-start rounded-md bg-white p-4">
        <p className="w-full text-left text-black lg:text-3xl">
          With ♥️ from Transit Club{" "}
          <b>
            <i>(@Techno3d, @wd7bxscience)</i>
          </b>
        </p>
      </div>
    </main>
  );
}
