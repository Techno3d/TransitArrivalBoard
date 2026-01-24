import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { Bullet } from "./Bullet";

export function AlertList() {
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
    <div className="flex h-full w-full flex-col gap-2 rounded-2xl border-black bg-black p-2">
      <div className="flex min-h-16 items-center justify-center rounded-lg bg-red-800 text-4xl font-extrabold text-white">
        <h1>Service Alerts</h1>
      </div>

      {messages.length > 0 ? (
        <div className="flex grow flex-row gap-2">
          <div className="flex h-full flex-row items-center rounded-lg bg-slate-100 px-2">
            <h1 className="w-[1ch] font-mono text-4xl leading-none font-extrabold break-all">{index + 1}</h1>
          </div>
          <div className="flex grow overflow-clip rounded-lg bg-slate-100 px-4">
            <h1 className="line-clamp-4 text-5xl leading-tight font-semibold text-pretty">
              {messages[index].split(/(\[.*?\])/).map((text, section) => {
                if (text.length == 0) return;
                if (text.substring(0, 1) != "[" || text.substring(text.length - 1) != "]") return text;
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
        <div className="flex grow items-center justify-center rounded-lg bg-white text-5xl font-semibold text-black">
          <h1 className="text-center">No active alerts</h1>
        </div>
      )}
    </div>
  );
}
