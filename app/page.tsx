import Image from "next/image";
import Bullet4 from "../public/subway/4.svg";
import BulletB from "../public/subway/B.svg";
import BulletD from "../public/subway/D.svg";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-r from-emerald-400 to-cyan-400 p-[2vh] gap-[2vh]">
      <span className="z-10 h-[62vh] w-full flex flex-row items-center justify-center gap-[2vh]">
        <div className="z-10 h-full w-4/6 font-mono text-sm bg-slate-50 rounded-lg justify-center items-center">
          <div className="h-full flex flex-col justify-center items-center gap-[1%] p-[1%]">
            <div className="w-full h-[7%] flex flex-row items-center">
              <h1 className="lg:text-5xl text-base w-full text-black font-black text-center">
                Bedford Park Blvd (Manhattan-bound)
              </h1>
            </div>
            <div className="w-full h-[30%] flex flex-row items-center">
              <div className="h-full aspect-square">
                <Image className="h-full w-full" src={Bullet4} alt={""}></Image>
              </div>
              <span className="bg-[#00933c] w-5/6 h-8 rounded-full items-center justify-center">
                <div className="bg-black w-[10%] h-[400%] justify-center"></div>
              </span>
            </div>
            <div className="w-full h-[30%] flex flex-row items-center">
              <div className="h-full aspect-square">
                <Image className="h-full w-full" src={BulletB} alt={""}></Image>
              </div>
              <span className="bg-[#ff6319] w-5/6 h-8 rounded-full"></span>
            </div>
            <div className="w-full h-[30%] flex flex-row items-center">
              <div className="h-full aspect-square">
                <Image className="h-full w-full" src={BulletD} alt={""}></Image>
              </div>
              <span className="bg-[#ff6319] w-5/6 h-8 rounded-full"></span>
            </div>
          </div>
        </div>
        <div className="z-10 h-full w-2/6 font-mono text-sm bg-slate-50 rounded-lg start-end">
          <div className="h-full flex flex-col justify-center items-center gap-[1%] p-[1%]">
            {" "}
            <h1 className="lg:text-5xl text-base w-full text-black font-black text-center">
              Paul Av/W 205 St
            </h1>
            <h1 className="lg:text-5xl text-base w-full text-black font-black text-center">
              W 205 St/Paul Av
            </h1>
          </div>
        </div>
      </span>
      <span className="z-10 h-[32vh] w-full flex items-center justify-center font-mono text-sm bg-slate-50  rounded-lg">
        HI
      </span>
    </main>
  );
}
