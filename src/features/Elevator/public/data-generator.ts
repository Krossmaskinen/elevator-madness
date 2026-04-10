import { getRandomNumber } from "$lib/utils/data-generator";
import type { Elevator } from "../types";

export const getElevator = (overrides?: Partial<Elevator>): Elevator => {
  return {
    id: `elevator-${getRandomNumber(0, 100000)}`,
    currentFloor: getRandomNumber(1, 10),
    targetFloor: null,
    isMoving: false,
    progress: 0,
    speedInMsPerFloor: 2000,
    ...overrides
  };
}