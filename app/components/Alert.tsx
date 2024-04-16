import Image from "next/image";
import React from "react";
import { Bullet } from "./Bullet";
import { Title } from "./Title";

export function Alert(props: { name: string; header: string; routes: { [key: string]: { color: string } } }) {
  let name = props.name;
  let header = props.header;
  let routes = props.routes;
  let parsed_header = header.split(/(\[.*?\])/);

  let temp = new Array<any>();

  parsed_header.map((text) => {
    if (text.charAt(0) === "[" && text.charAt(text.length - 1) === "]") {
      temp.push(
        <div className="mx-1 inline-flex -translate-y-[6px]" key={1}>
          <Bullet route={text.charAt(1)} color={routes[text.charAt(1)].color} size={48} />
        </div>,
      );
    } else {
      temp.push(text);
    }
  });

  return (
    <React.Fragment>
      <div className="flex h-14 flex-row items-center rounded-lg bg-red-600">
        <Title name={name}></Title>
      </div>
      <div className="flex w-full grow flex-row rounded-lg bg-slate-100 p-2">
        <h1 className="line-clamp-4 text-5xl font-bold">{temp}</h1>
      </div>
      <div className="flex h-14 flex-row items-center rounded-lg bg-slate-800">
        <h1 className="mx-2 text-base font-bold text-white lg:text-3xl">
          {"Made with ❤️ by "}
          <span className="inline-flex items-baseline">
            <Image
              src="https://cdn.discordapp.com/icons/1031746725817368676/ac3bfe2c8dd9b89729974f3c5888f99c"
              alt=""
              className="mx-1 self-center rounded-full"
              height={32}
              width={32}
            />
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
