export function Bullet(props: { short_name: string; color: string; text_color: string; size: number }) {
  let short_name = props.short_name;
  let color = props.color;
  let text_color = props.text_color;
  let size = props.size;

  if (short_name.length <= 1) {
    return (
      <span
        className="flex items-center justify-center rounded-full"
        style={{
          backgroundColor: `#${color}`,
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <h1
          className="text-center font-bold "
          style={{
            fontSize: `${size * 0.65}px`,

            color: `#FFFFFF`,
            // Due to the MTA forgetting to add route_text_color to their GTFS static files,
            // we'll have to manually set all the colors to white at the expense of the BMT Broadway Line bullets
            // color: `#${text_color}`

            minWidth: `${size}px`,
          }}
        >
          {short_name}
        </h1>
      </span>
    );
  }

  if (short_name.length <= 2 && short_name.substring(1) == "X") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <span
          className="flex rotate-[45deg] items-center justify-center"
          style={{
            backgroundColor: `#${color}`,
            height: `${size / Math.sqrt(2)}px`,
            width: `${size / Math.sqrt(2)}px`,
          }}
        >
          <h1
            className="rotate-[-45deg] text-center font-bold"
            style={{
              fontSize: `${size * 0.65}px`,

              color: `#FFFFFF`,
              // Due to the MTA forgetting to add route_text_color to their GTFS static files,
              // we'll have to manually set all the colors to white at the expense of the BMT Broadway Line bullets
              // color: `#${text_color}`
            }}
          >
            {short_name.substring(0, 1)}
          </h1>
        </span>
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
        className="line-clamp-1 text-center font-bold"
        style={{
          fontSize: `${size * 0.65}px`,
          color: `#${text_color}`,
          paddingLeft: `${size * 0.2}px`,
          paddingRight: `${size * 0.2}px`,
          minWidth: `${size}px`,
        }}
      >
        {short_name}
      </h1>
    </span>
  );
}
