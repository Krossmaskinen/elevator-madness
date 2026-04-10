import type { Elevator } from "../types";

export const getRandomNumber = (min: number, max: number, exclude?: number): number => {
  let result;
  do {
    result = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (result === exclude);

  return result;
};

export const getRandomBool = (): boolean => {
  return Math.random() > 0.5;
};

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