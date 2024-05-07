export function Bullet(props: { route: string; color: string; size: number }) {
  let route = props.route;
  let color = props.color;
  let size = props.size;

  if (route.length <= 1) {
    return (
      <span
        className="flex items-center justify-center rounded-full"
        style={{
          backgroundColor: `#${color}`,
          height: `${size}px`,
        }}
      >
        <h1
          className="font-bold text-center text-white"
          style={{
            fontSize: `${size * 0.65}px`,
            minWidth: `${size}px`,
          }}
        >
          {route}
        </h1>
      </span>
    );
  }

  return (
    <span
      className="flex items-center justify-center rounded-2xl"
      style={{
        backgroundColor: `#${color}`,
        height: `${size}px`,
      }}
    >
      <h1
        className="line-clamp-1 font-bold text-center text-white"
        style={{
          fontSize: `${size * 0.65}px`,
          paddingLeft: `${size * 0.2}px`,
          paddingRight: `${size * 0.2}px`,
          minWidth: `${size}px`,
        }}
      >
        {route}
      </h1>
    </span>
  );
}
