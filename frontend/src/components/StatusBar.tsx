import { Fragment, useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

type StatusLevel = "OK" | "WARNING" | "ERROR";

export type Status = {
  type: StatusLevel;
  message: string;
};

export function StatusBar(props: { maintainers: Array<{ name: string; github_id: number }> }) {
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
      <div className="min-h-0 grow overflow-hidden text-start">
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
      <div className="text-center">
        <h1>
          {"Made with ❤️ by "}

          {props.maintainers.length > 1
            ? props.maintainers.map((maintainer, index) => {
                return (
                  <Fragment key={maintainer.name}>
                    <span className="inline-flex items-baseline">
                      <img
                        src={`https://avatars.githubusercontent.com/u/${maintainer.github_id}`}
                        className="mx-2 aspect-square h-9 self-center rounded-full"
                      />
                      <span>{maintainer.name}</span>
                    </span>

                    {props.maintainers.length >= 3 && index <= props.maintainers.length - 3 ? ", " : ""}
                    {props.maintainers.length >= 3 && index == props.maintainers.length - 2 ? ", and " : ""}
                    {props.maintainers.length == 2 && index == props.maintainers.length - 2 ? " and " : ""}
                  </Fragment>
                );
              })
            : "no one"}
        </h1>
      </div>
      <div className="min-h-0 grow overflow-hidden text-end">
        <h1>{time}</h1>
      </div>
    </div>
  );
}
