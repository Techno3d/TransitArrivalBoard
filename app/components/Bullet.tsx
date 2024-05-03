export function Bullet(props: { route: string; color: string; size: number }) {
  let route = props.route;
  let color = props.color;
  let size = props.size;
  return (
    <span
      className="flex aspect-square items-center justify-center rounded-full"
      style={{
        backgroundColor: `#${color}`,
        height: `${size}px`,
      }}
    >
      <h1
        className="overflow-hidden text-clip text-nowrap text-center font-bold text-white"
        style={{ fontSize: `${size * 0.65}px`, paddingLeft: `${size * 0.15}px`, paddingRight: `${size * 0.15}px` }}
      >
        {route}
      </h1>
    </span>
  );
}
