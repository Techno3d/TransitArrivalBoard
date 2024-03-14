import Image from "next/image";
import Bullet4 from "../public/subway/4.svg";
import BulletB from "../public/subway/B.svg";
import BulletD from "../public/subway/D.svg";

export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-black p-4 gap-4">
      <span className="z-10 h-[65vh] w-full flex flex-row items-center justify-center gap-4">
        <div className="z-10 h-full w-4/6 font-mono text-sm bg-white rounded-lg self-start justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="w-full flex flex-row">
              <Image className="w-24" src={Bullet4} alt={""}></Image>
            </div>
            <div className="w-full flex flex-row">
              <Image className="w-24" src={BulletB} alt={""}></Image>
            </div>
            <div className="w-full flex flex-row">
              <Image className="w-24" src={BulletD} alt={""}></Image>
            </div>
          </div>
        </div>
        <div className="z-10 h-full w-2/6 font-mono text-sm bg-white rounded-lg start-end">
          <h1>Hello!</h1>
        </div>
      </span>
      <span className="z-10 h-[30vh] w-full flex items-center justify-center font-mono text-sm bg-white rounded-lg">
        HI
      </span>
    </main>
  );
}
