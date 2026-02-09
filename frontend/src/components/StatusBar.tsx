import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

type StatusLevel = "OK" | "WARNING" | "ERROR";

export type Status = {
  type: StatusLevel;
  message: string;
};

export function StatusBar(props: { credits: string }) {
  const { status } = useContext(SocketContext);

  const [time, setTime] = useState<string>(
    new Date().toLocaleString("en-US", {
      hour12: true,
      timeZone: "America/New_York",
      timeStyle: "short",
      dateStyle: "short",
    }),
  );

  useEffect(() => {
    const loop = setInterval(() => {
      setTime(
        new Date().toLocaleString("en-US", {
          hour12: true,
          timeZone: "America/New_York",
          timeStyle: "short",
          dateStyle: "short",
        }),
      );
    }, 1000);

    return () => {
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="flex h-12 shrink-0 flex-row items-center overflow-hidden bg-black px-2 text-3xl font-semibold text-white">
      <div className="flex-1 text-start">
        <h1>
          {"Status: "}
          {(() => {
            switch (status.type) {
              case "OK":
                return (
                  <span className="inline-flex items-baseline rounded-xl bg-green-600 px-2">{status.message}</span>
                );
              case "WARNING":
                return (
                  <span className="inline-flex items-baseline rounded-xl bg-yellow-600 px-2">{status.message}</span>
                );
              default:
                return <span className="inline-flex items-baseline rounded-xl bg-red-600 px-2">{status.message}</span>;
            }
          })()}
        </h1>
      </div>
      <div className="flex flex-row text-center">
        {props.credits.split(/(\[.*?\])/).map((text, section) => {
          if (text.startsWith("[") && text.endsWith("]")) {
            return (
              <img
                key={section}
                src={text.substring(1, text.length - 1)}
                className="mx-2 aspect-square h-9 self-center rounded-full"
              />
            );
          }
          return <h1>{text}</h1>;
        })}
      </div>
      <div className="flex-1 text-end">
        <h1>{time}</h1>
      </div>
    </div>
  );
}
