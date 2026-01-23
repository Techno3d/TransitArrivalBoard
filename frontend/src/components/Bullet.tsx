import { Route } from "@/types";
import { Roboto_Mono } from "next/font/google";

const roboto = Roboto_Mono({ subsets: ["latin"] });

export function Bullet(props: { route: Route; size: number }) {
  if (!props.route) {
    return;
  }

  if (props.route.route_name.length <= 0) {
    return;
  }

  // Circle subway bullet
  if (props.route.route_name.length <= 1) {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          height: `${props.size}px`,
          width: `${props.size}px`,
        }}
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            backgroundColor: `#${props.route.route_color}`,
            height: `${props.size}px`,
            width: `${props.size}px`,
          }}
        >
          <h1
            className={`${roboto.className} text-center font-bold text-nowrap`}
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name}
          </h1>
        </span>
      </span>
    );
  }

  // Diamond subway bullet
  if (props.route.route_name.length <= 2 && props.route.route_name.substring(1) == "X") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          height: `${props.size}px`,
          width: `${props.size}px`,
        }}
      >
        <span
          className="flex rotate-45 items-center justify-center"
          style={{
            backgroundColor: `#${props.route.route_color}`,
            height: `${props.size / Math.sqrt(2)}px`,
            width: `${props.size / Math.sqrt(2)}px`,
          }}
        >
          <h1
            className={`${roboto.className} -rotate-45 text-center font-bold text-nowrap`}
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name.substring(0, 1)}
          </h1>
        </span>
      </span>
    );
  }

  // Station Island Railway bullet
  if (props.route.route_name.length <= 3 && props.route.route_name == "SIR") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          height: `${props.size}px`,
          width: `${props.size}px`,
        }}
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            backgroundColor: `#${props.route.route_color}`,
            height: `${props.size}px`,
            width: `${props.size}px`,
          }}
        >
          <h1
            className={`${roboto.className} text-center font-bold text-nowrap`}
            style={{
              fontSize: `${props.size * 0.5}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name}
          </h1>
        </span>
      </span>
    );
  }

  // Bus bullet
  return (
    <span
      className="flex items-center justify-center rounded-2xl"
      style={{
        backgroundColor: `#${props.route.route_color}`,
        height: `${props.size}px`,
      }}
    >
      <h1
        className={`${roboto.className} text-center font-bold text-nowrap`}
        style={{
          fontSize: `${props.size * 0.65}px`,
          color: `#${props.route.route_text_color}`,
          paddingLeft: `${props.size * 0.25}px`,
          paddingRight: `${props.size * 0.25}px`,
        }}
      >
        {props.route.route_name}
      </h1>
    </span>
  );
}
