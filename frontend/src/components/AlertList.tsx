import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import type { Route } from "../types";
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

  const affected_routes: Array<Route> = [];
  alerts.slice().map((alert) => {
    if (!routes[alert.route_id]) return;
    if (affected_routes.indexOf(routes[alert.route_id]) != -1) return;
    if (alert.sort_order < 14) return;
    affected_routes.push(routes[alert.route_id]);
  });
  affected_routes.sort((a, b) => (a.route_sort_order < b.route_sort_order ? -1 : 1));

  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const loop = setInterval(() => {
      setIndex(index + 1);
    }, 5000);

    return () => {
      clearInterval(loop);
    };
  });

  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border-black bg-black p-2">
      <div
        className="flex h-16 shrink-0 items-center justify-center rounded-lg text-4xl font-extrabold"
        style={{ backgroundColor: props.name_background_color, color: props.name_text_color }}
      >
        <h1>{props.name}</h1>
      </div>

      <div className="flex min-h-0 grow flex-col gap-2">
        {messages.length > 0 ? (
          <div className="flex min-h-0 grow flex-row overflow-hidden rounded-lg bg-slate-200">
            <div className="flex h-full flex-row items-center rounded-lg bg-slate-100 px-2 shadow-2xl">
              <h1 className="w-[1ch] font-mono text-4xl leading-none font-extrabold break-all">
                {(index % messages.length) + 1}
              </h1>
            </div>
            <div className="flex min-h-0 grow overflow-hidden rounded-lg px-4">
              <h1 className="text-4xl leading-tight font-semibold text-pretty">
                {messages[index % messages.length].split(/(\[.*?\])/).map((text, section) => {
                  if (!routes[text.substring(1, text.length - 1)]) return text;
                  return (
                    <div className="mx-1 inline-flex -translate-y-1.5" key={section}>
                      <Bullet route={routes[text.substring(1, text.length - 1)]} size={32} />
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
        {affected_routes.length > 0 ? (
          <div className="flex shrink-0 flex-row items-center gap-2 overflow-hidden rounded-lg bg-slate-100 p-2">
            {affected_routes.map((routes) => {
              return <Bullet route={routes} size={36}></Bullet>;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
