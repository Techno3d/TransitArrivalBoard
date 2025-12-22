export const config: { subway: Array<StopConfig>; bus: Array<StopConfig> } = {
  subway: [
    {
      stop_ids: ["116N", "A15N"],
      walk_time: 5,
    },
    {
      stop_ids: ["116S", "A15S"],
      walk_time: 5,
    },
  ],
  bus: [
    {
      stop_ids: ["100017", "103400"],
      walk_time: 3,
    },
    {
      stop_ids: ["100723"],
      walk_time: 3,
    },
  ],
};

interface StopConfig {
  stop_ids: Array<string>;
  walk_time: number;
}
