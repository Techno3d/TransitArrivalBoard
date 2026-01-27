import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { Bullet } from "./Bullet";

export function AlertList(props: { name: string; name_text_color: string; name_background_color: string }) {
  const { routes, alerts } = useContext(SocketContext);

  const messages: Array<string> = [];
  alerts
    .slice()
    .reverse()
    .map((alert) => {
      if (messages.indexOf(alert.header_text) != -1) return;
      if (alert.sort_order < 22) return;
      messages.push(alert.header_text);
    });

  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const loop = setInterval(() => {
      if (messages.length > 0) {
        setIndex((i) => (((i + 1) % messages.length) + messages.length) % messages.length);
        return;
      }

      setIndex(0);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border-black bg-black p-2">
      <div
        className="flex h-16 shrink-0 items-center justify-center rounded-lg text-4xl font-extrabold"
        style={{ backgroundColor: props.name_background_color, color: props.name_text_color }}
      >
        <h1>{props.name}</h1>
      </div>

      {messages.length > 0 ? (
        <div className="flex min-h-0 grow flex-row gap-2 overflow-hidden">
          <div className="flex h-full flex-row items-center rounded-lg bg-slate-100 px-2">
            <h1 className="w-[1ch] font-mono text-4xl leading-none font-extrabold break-all">{index + 1}</h1>
          </div>
          <div className="flex min-h-0 grow overflow-hidden rounded-lg bg-slate-100 px-4">
            <h1 className="text-5xl leading-tight font-semibold text-pretty">
              {messages[index].split(/(\[.*?\])/).map((text, section) => {
                if (!routes[text.substring(1, text.length - 1)]) return text;
                return (
                  <div className="mx-1 inline-flex -translate-y-1.5" key={section}>
                    <Bullet route={routes[text.substring(1, text.length - 1)]} size={42} />
                  </div>
                );
              })}
            </h1>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 grow items-center justify-center overflow-hidden rounded-lg bg-white text-5xl font-semibold text-black">
          <h1 className="text-center">No active alerts</h1>
        </div>
      )}
    </div>
  );
}
