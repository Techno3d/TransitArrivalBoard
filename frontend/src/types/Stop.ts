import type { Vehicle } from "./Vehicle";

export type Stop = { name: string, trips: Array<Vehicle>, destinations: { [key: string]: { [key: string]: Array<Vehicle> } }, };