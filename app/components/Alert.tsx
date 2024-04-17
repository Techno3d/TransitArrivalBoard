import Image from "next/image";
import React from "react";
import Logo from "../../public/logo.png";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function Alert(props: {
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
      <div className="flex h-14 flex-row items-center rounded-lg bg-red-600">
        {headers.length > 1 ? (
          <Title name={name + " (" + (index + 1) + "/" + headers.length + ")"}></Title>
        ) : (
          <Title name={name}></Title>
        )}
      </div>

      {headers.length > 0 ? (
        <div className="flex w-full grow flex-row items-start rounded-lg bg-slate-100 px-4 py-2">
          <h1 className="line-clamp-3 text-4xl font-semibold leading-relaxed">
            {headers[index].split(/(\[.*?\])/).map((text) => {
              if (text.length === 0) return;
              if (text.charAt(0) === "[" && text.charAt(text.length - 1) === "]") {
                return (
                  <div className="mx-1 inline-flex -translate-y-1" key={Math.random()}>
                    <Bullet route={text.charAt(1)} color={routes[text.charAt(1)].route_color} size={36} />
                  </div>
                );
              }
              return text;
            })}
          </h1>
        </div>
      ) : (
        <div className="flex w-full grow flex-row items-center rounded-lg bg-slate-100">
          <h1 className="w-full p-8 text-center text-8xl font-bold text-black">No service disruptions</h1>
        </div>
      )}

      <div className="flex h-14 flex-row items-center rounded-lg bg-slate-800">
        <h1 className="mx-2 text-base font-bold text-white lg:text-3xl">
          {"Made with ❤️ by "}
          <span className="inline-flex items-baseline">
            <Image src={Logo} alt="" className="mx-1 self-center rounded-full" height={32} width={32} />
            <span>Transit Club</span>
          </span>
          {" ("}
          <span className="inline-flex items-baseline">
            <Image
              src="https://avatars.githubusercontent.com/u/76977073?"
              alt=""
              className="mx-1 self-center rounded-full"
              height={32}
              width={32}
            />
            <span>Shadman Syed</span>
            {", "}
          </span>
          <span className="inline-flex items-baseline">
            <Image
              src="https://avatars.githubusercontent.com/u/95447323?"
              alt=""
              className="mx-1 self-center rounded-full"
              height={32}
              width={32}
            />
            <span>David Wang</span>
          </span>
          {")"}
        </h1>
      </div>
    </React.Fragment>
  );
}
