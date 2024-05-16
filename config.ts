export const config: { subway: Array<StopConfig>; bus: Array<StopConfig> } = {
  subway: [
    {
      stop_ids: ["624S"],
      walk_time: 10,
    },
    {
      stop_ids: ["Q05S"],
      walk_time: 14,
    },
  ],
  bus: [
    {
      stop_ids: ["401749", "803182"],
      walk_time: 3,
    },
    {
      stop_ids: ["403632"],
      walk_time: 3,
    },
  ],
};

interface StopConfig {
  stop_ids: Array<string>;
  walk_time: number;
}
