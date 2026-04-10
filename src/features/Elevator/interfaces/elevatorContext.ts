import type { Elevator } from "../types";

export interface IElevatorContext {
  getElevators(): Elevator[];
}