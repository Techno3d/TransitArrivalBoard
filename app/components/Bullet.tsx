export function Bullet(props: { short_name: string; color: string; text_color: string; size: number }) {
  if (props.short_name.length <= 0) {
    return;
  }

  if (props.short_name.length <= 1) {
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
            backgroundColor: `#${props.color}`,
            height: `${props.size}px`,
            width: `${props.size}px`,
          }}
        >
          <h1
            className="text-center font-bold "
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.text_color}`,
            }}
          >
            {props.short_name}
          </h1>
        </span>
      </span>
    );
  }

  if (props.short_name.length <= 2 && props.short_name.substring(1) == "X") {
    return (
      <span
        className="flex items-center justify-center"
        style={{
          height: `${props.size}px`,
          width: `${props.size}px`,
        }}
      >
        <span
          className="flex rotate-[45deg] items-center justify-center"
          style={{
            backgroundColor: `#${props.color}`,
            height: `${props.size / Math.sqrt(2)}px`,
            width: `${props.size / Math.sqrt(2)}px`,
          }}
        >
          <h1
            className="rotate-[-45deg] text-center font-bold"
            style={{
              fontSize: `${props.size * 0.65}px`,
              color: `#${props.text_color}`,
            }}
          >
            {props.short_name.substring(0, 1)}
          </h1>
        </span>
      </span>
    );
  }

  return (
    <span
      className="flex items-center justify-center rounded-2xl"
      style={{
        backgroundColor: `#${props.color}`,
        height: `${props.size}px`,
      }}
    >
      <h1
        className="line-clamp-1 text-center font-bold"
        style={{
          fontSize: `${props.size * 0.65}px`,
          color: `#${props.text_color}`,
          paddingLeft: `${props.size * 0.175}px`,
          paddingRight: `${props.size * 0.175}px`,
        }}
      >
        {props.short_name}
      </h1>
    </span>
  );
}
