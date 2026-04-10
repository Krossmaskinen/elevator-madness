import type { Elevator } from "../../features/Elevator/types";

export function hasInboundElevator(floor: number, elevators: Elevator[]) {
  return elevators.some(el => el.targetFloor === floor);
}

export function getElevatorOnFloor(floor: number, elevators: Elevator[]): string | undefined {
  return elevators.find(el => el.currentFloor === floor && !el.isMoving)?.id;
}


export function getClosestElevatorToFloor(floor: number, elevators: Elevator[]) {
  let closestElevator: string | undefined;
  let closestDistance = NaN;

  elevators.forEach((elevator) => {
    if (elevator.isMoving || closestDistance <= 1) {
      return;
    }

    if (closestElevator) {
      const distance = Math.abs(elevator.currentFloor - floor);

      if (distance < closestDistance) {
        closestElevator = elevator.id;
        closestDistance = distance;
      }
    } else {
      closestElevator = elevator.id;
      closestDistance = Math.abs(elevator.currentFloor - floor);
    }
  })

  return closestElevator;
}