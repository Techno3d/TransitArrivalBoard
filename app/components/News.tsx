/*
import React from "react";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function News(props: {
  name: string;
  headers: Array<string>;
  routes: { [key: string]: { [key: string]: string } };
  index: number;
}) {
  let name = props.name;
  let headers = props.headers;
  let routes = props.routes;
  let index = props.index;

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-emerald-700">
        {headers.length > 0 ? (
          <Title name={name + " (" + (index + 1) + "/" + headers.length + ")"}></Title>
        ) : (
          <Title name={name}></Title>
        )}
      </div>

      {headers.length > 0 ? (
        <div className="flex h-51 w-full flex-row items-start rounded-lg bg-slate-100 px-4 py-2">
          <h1 className="line-clamp-5 text-pretty font-semibold 2xl:text-4xl 2xl:leading-tight">
            {headers[index].split(/(\[.*?\])/).map((text) => {
              if (text.length === 0) return;
              if (text.charAt(0) === "[" && text.charAt(text.length - 1) === "]") {
                return (
                  <div className="mx-1 inline-flex -translate-y-1.5" key={Math.random()}>
                    <Bullet
                      short_name={text.charAt(1)}
                      color={routes[text.charAt(1)].route_color}
                      text_color={routes[text.charAt(1)].route_text_color}
                      size={42}
                    />
                  </div>
                );
              }
              return text;
            })}
          </h1>
        </div>
      ) : (
        <div className="flex w-full grow flex-row items-center rounded-lg bg-slate-100">
          <h1 className="w-full text-center font-bold text-black 2xl:text-5xl">No active alerts </h1>
        </div>
      )}
    </React.Fragment>
  );
}
*/
