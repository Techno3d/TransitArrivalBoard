import { Route } from "@/types/Route";
import { Bullet } from "./Bullet";

export function Message(props: { routes: Record<string, Route>; name: string; headers: Array<string>; index: number }) {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-2xl border-black bg-black p-2">
      <div className="flex min-h-16 items-center justify-center rounded-lg bg-red-800 text-4xl font-extrabold text-white">
        {props.headers.length > 0 ? (
          <h1>{props.name + " (" + (props.index + 1) + "/" + props.headers.length + ")"}</h1>
        ) : (
          <h1>{props.name}</h1>
        )}
      </div>

      {props.headers.length > 0 ? (
        <div className="flex grow flex-row items-start rounded-lg bg-slate-100 px-4">
          <h1 className="line-clamp-4 text-5xl leading-tight font-semibold text-pretty">
            {props.headers[props.index].split(/(\[.*?\])/).map((text, index) => {
              if (text.length == 0) return;
              if (text.substring(0, 1) != "[" || text.substring(text.length - 1) != "]") return text;
              return (
                <div className="mx-1 inline-flex -translate-y-1.5" key={index}>
                  <Bullet route={props.routes[text.substring(1, text.length - 1)]} size={42} />
                </div>
              );
            })}
          </h1>
        </div>
      ) : (
        <div className="flex grow items-center justify-center rounded-lg bg-white text-5xl font-semibold text-black">
          <h1 className="text-center">No active alerts</h1>
        </div>
      )}
    </div>
  );
}
