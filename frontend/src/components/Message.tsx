import { useEffect, useState } from "react";
import { type Route } from "../types";
import { Bullet } from "./Bullet";

export function Message(props: { routes: Record<string, Route>; name: string; messages: Array<string> }) {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const loop = setInterval(() => {
      if (props.messages.length > 0) {
        setIndex((i) => (((i + 1) % props.messages.length) + props.messages.length) % props.messages.length);
        return;
      }

      setIndex(0);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [props.messages.length]);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-2xl border-black bg-black p-2">
      <div className="flex min-h-16 items-center justify-center rounded-lg bg-red-800 text-4xl font-extrabold text-white">
        {props.messages.length > 0 ? (
          <h1>{props.name + " (" + (index + 1) + "/" + props.messages.length + ")"}</h1>
        ) : (
          <h1>{props.name}</h1>
        )}
      </div>

      {props.messages.length > 0 ? (
        <div className="flex flex-1 flex-row items-start overflow-clip rounded-lg bg-slate-100 px-4">
          <h1 className="line-clamp-4 text-5xl leading-tight font-semibold text-pretty">
            {props.messages[index].split(/(\[.*?\])/).map((text, section) => {
              if (text.length == 0) return;
              if (text.substring(0, 1) != "[" || text.substring(text.length - 1) != "]") return text;
              return (
                <div className="mx-1 inline-flex -translate-y-1.5" key={section}>
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
