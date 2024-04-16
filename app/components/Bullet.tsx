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
      <h1 className="text-center font-bold text-white" style={{ fontSize: `${size * 0.65}px` }}>
        {route}
      </h1>
    </span>
  );
}
