import { getElevator } from "../../features/Elevator/public/data-generator";
import { getRandomNumber } from "./data-generator";
import { getClosestElevatorToFloor, getElevatorOnFloor, hasInboundElevator } from "./elevatorUtils";

describe('Elevator Utils', () => {
  it("should see if a floor has an elevator", () => {
      const currentFloor = getRandomNumber(0, 10);
      const elevator = getElevator({
        currentFloor,
        isMoving: false,
        targetFloor: null,
        id: "1",
      });
  
      expect(getElevatorOnFloor(currentFloor, [elevator])).toBe("1");
  
      elevator.isMoving = true;
      expect(getElevatorOnFloor(currentFloor, [elevator])).toBeFalsy();
  
      elevator.isMoving = false;
      elevator.currentFloor = 11;
      expect(getElevatorOnFloor(currentFloor, [elevator])).toBeFalsy();
    });

  it("should find the closest elevator to a floor", () => {
    const elevator1 = getElevator({ currentFloor: 0, id: "1" });
    const elevator2 = getElevator({ currentFloor: 5, id: "2" });
    const elevator3 = getElevator({ currentFloor: 10, id: "3" });
    const elevators = [
      elevator1, elevator2, elevator3
    ]

    const closestElevatorToFloor4 =
      getClosestElevatorToFloor(4, elevators);
    expect(closestElevatorToFloor4).toBe("2");

    const closestElevatorToFloor9 =
      getClosestElevatorToFloor(9, elevators);
    expect(closestElevatorToFloor9).toBe("3");

    const closestElevatorToFloor1 =
      getClosestElevatorToFloor(1, elevators);
    expect(closestElevatorToFloor1).toBe("1");
  });

  it("should see if a floor has an inbound elevator", () => {
    const targetFloor = getRandomNumber(0, 10);
    const elevators = [getElevator({
      currentFloor: 0,
      isMoving: true,
      targetFloor,
      id: "1",
    })];

    expect(hasInboundElevator(targetFloor, elevators)).toBeTruthy();
  });
})