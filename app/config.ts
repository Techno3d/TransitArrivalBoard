import { Config } from "./types";

export const config: Config = {
  subway: [
    {
      stop_ids: ["405S"],
      walk_time: 10,
    },
    {
      stop_ids: ["D03S"],
      walk_time: 14,
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
