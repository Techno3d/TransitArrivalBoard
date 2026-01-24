import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { type Route } from "../types";

function StatusDot(props: { size: number; severity: number }) {
  if (props.severity <= 0) {
    return;
  }

  if (props.severity <= 13) {
    return (
      <span
        className="absolute flex items-center justify-center rounded-full border-white bg-slate-700"
        style={{
          left: `${props.size * 0.65}px`,
          bottom: `${props.size * 0.65}px`,
          height: `${props.size * 0.35}px`,
          width: `${props.size * 0.35}px`,
          borderWidth: `${props.size * 0.01}px`,
        }}
      >
        <h1
          className="text-center font-extrabold text-white"
          style={{
            fontSize: `${props.size * 0.25}px`,
          }}
        >
          i
        </h1>
      </span>
    );
  }

  if (props.severity <= 21) {
    return (
      <span
        className="absolute flex items-center justify-center rounded-full border-white bg-yellow-500"
        style={{
          left: `${props.size * 0.65}px`,
          bottom: `${props.size * 0.65}px`,
          height: `${props.size * 0.35}px`,
          width: `${props.size * 0.35}px`,
          borderWidth: `${props.size * 0.01}px`,
        }}
      >
        <h1
          className="text-center font-extrabold text-black"
          style={{
            fontSize: `${props.size * 0.25}px`,
          }}
        >
          i
        </h1>
      </span>
    );
  }

  return (
    <span
      className="absolute flex items-center justify-center rounded-full border-white bg-red-500"
      style={{
        left: `${props.size * 0.65}px`,
        bottom: `${props.size * 0.65}px`,
        height: `${props.size * 0.35}px`,
        width: `${props.size * 0.35}px`,
        borderWidth: `${props.size * 0.01}px`,
      }}
    >
      <h1
        className="text-center font-extrabold text-white"
        style={{
          fontSize: `${props.size * 0.25}px`,
        }}
      >
        !
      </h1>
    </span>
  );
}

export function Bullet(props: { route: Route; size: number }) {
  const { alerts } = useContext(SocketContext);
  if (!props.route) {
    return;
  }

  if (props.route.route_name.length <= 0) {
    return;
  }

  let sort_order = 0;
  alerts.forEach((alert) => {
    if (alert.route_id.indexOf(props.route.route_id) == -1) return;

    sort_order = Math.max(sort_order, alert.sort_order);
  });

  if (sort_order > 21) {
    sort_order = 22;
  }

  // Circle subway bullet
  if (props.route.route_name.length <= 1) {
    return (
      <span
        className="relative flex items-center justify-center"
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
            className="text-center font-mono font-bold text-nowrap"
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name}
          </h1>
        </span>
        <StatusDot size={props.size} severity={sort_order} />
      </span>
    );
  }

  // Diamond subway bullet
  if (props.route.route_name.length <= 2 && props.route.route_name.substring(1) == "X") {
    return (
      <span
        className="relative flex items-center justify-center"
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
            className="-rotate-45 text-center font-mono font-bold text-nowrap"
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name.substring(0, 1)}
          </h1>
        </span>
        <StatusDot size={props.size} severity={sort_order} />
      </span>
    );
  }

  // Station Island Railway bullet
  if (props.route.route_name.length <= 3 && props.route.route_name == "SIR") {
    return (
      <span
        className="relative flex items-center justify-center"
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
            className="text-center font-mono font-bold text-nowrap"
            style={{
              fontSize: `${props.size * 0.5}px`,
              color: `#${props.route.route_text_color}`,
            }}
          >
            {props.route.route_name}
          </h1>
        </span>
        <StatusDot size={props.size} severity={sort_order} />
      </span>
    );
  }

  // Bus bullet
  return (
    <span
      className="relative flex items-center justify-center rounded-2xl"
      style={{
        backgroundColor: `#${props.route.route_color}`,
        height: `${props.size}px`,
      }}
    >
      <h1
        className="text-center font-mono font-bold text-nowrap"
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
