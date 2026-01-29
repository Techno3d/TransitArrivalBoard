import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import config from "../../config.json";

export function Fallback() {
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
    <div className="flex h-full touch-none flex-col gap-2 overflow-hidden overscroll-none bg-black font-sans select-none">
      <div
        className="min-h-0 grow gap-2 overflow-hidden p-2 text-black"
        style={{ backgroundColor: config.theme.background_color }}
      >
        <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border-black bg-black">
          <h1 className="text-center text-4xl text-balance text-white">
            Ladies and gentlemen, because of an unforseen error, this board is no longer in service. We apologize for
            any inconvenience. <br /> <br /> Please check the MTA website or app for real-time information.
          </h1>
        </div>
      </div>
      <div className="flex h-12 shrink-0 flex-row items-center overflow-hidden bg-black px-2 text-3xl font-semibold text-white">
        <div className="flex-1 text-start">
          <h1>
            {"Status: "}
            <span className="inline-flex items-baseline rounded-xl bg-red-600 px-2">{"Error"}</span>
          </h1>
        </div>
        <div className="text-center">
          <h1>
            {"Made with ❤️ by "}

            {config.maintainers.length > 0
              ? config.maintainers.map((maintainer, index) => {
                  return (
                    <Fragment key={maintainer.name}>
                      <span className="inline-flex items-baseline">
                        {maintainer.github_id ? (
                          <img
                            src={`https://avatars.githubusercontent.com/u/${maintainer.github_id}`}
                            className="mx-2 aspect-square h-9 self-center rounded-full"
                          />
                        ) : null}

                        <span>{maintainer.name}</span>
                      </span>

                      {config.maintainers.length >= 3 && index <= config.maintainers.length - 3 ? ", " : ""}
                      {config.maintainers.length >= 3 && index == config.maintainers.length - 2 ? ", and " : ""}
                      {config.maintainers.length == 2 && index == config.maintainers.length - 2 ? " and " : ""}
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
    </div>
  );
}
