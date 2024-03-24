export default function Box() {
  return (
    <div className="h-full w-4/6 items-center justify-center rounded-lg bg-slate-50 font-mono text-sm">
      <div className="flex h-full flex-col items-center justify-center gap-[1%] p-[1%]">
        <div className="flex h-[7%] w-full flex-row items-center rounded-lg bg-[#007261]">
          <h1 className="w-full text-center text-base font-black text-white lg:text-3xl ">
            Bedford Park Blvd (Manhattan-bound)
          </h1>
        </div>
      </div>
    </div>
  );
}
