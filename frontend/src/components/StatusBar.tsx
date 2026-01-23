import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

type StatusLevel = "OK" | "WARNING" | "ERROR";

export type Status = {
  type: StatusLevel;
  message: string;
};

export function StatusBar(props: { status: Status; maintainers: Array<{ name: string; github_id: number }> }) {
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
    <div className="flex h-12 w-full flex-row items-center bg-black px-2 text-3xl font-semibold text-white">
      <div className="flex-1 text-start">
        <h1>
          {"Status: "}
          {(() => {
            switch (props.status.type) {
              case "OK":
                return (
                  <span className="inline-flex items-baseline rounded-xl bg-green-600 px-2">
                    {props.status.message}
                  </span>
                );
              case "WARNING":
                return (
                  <span className="inline-flex items-baseline rounded-xl bg-yellow-600 px-2">
                    {props.status.message}
                  </span>
                );
              default:
                return (
                  <span className="inline-flex items-baseline rounded-xl bg-red-600 px-2">{props.status.message}</span>
                );
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
                      <Image
                        src={`https://avatars.githubusercontent.com/u/${maintainer.github_id}`}
                        alt=""
                        className="mx-2 self-center rounded-full"
                        height={36}
                        width={36}
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
      <div className="flex-1 text-end">
        <h1>{time}</h1>
      </div>
    </div>
  );
}
