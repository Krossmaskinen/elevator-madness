import { getElevator } from "../public/data-generator";
import type { IElevatorContext } from "../interfaces/elevatorContext";
import type { Elevator } from "../types";
import { ElevatorService } from "./elevatorService";
import { getRandomNumber } from "$lib/utils/data-generator";

describe("ElevatorService", () => {
  it("should call the elevator to a specific floor", () => {
    const elevator = getElevator({ currentFloor: 0 });
    const elevatorContext = getElevatorContext([elevator]);
    const elevatorService = getElevatorService([elevator]);

    elevatorService.callElevator(5);

    expect(elevatorContext.getElevators()[0].targetFloor).toBe(5);
  });

  it("should update the elevator progress", () => {
    const currentFloor = getRandomNumber(0, 10);
    const targetFloor = getRandomNumber(0, 10, currentFloor);
    const numbersOfFloorsToMove = Math.abs(targetFloor - currentFloor);
    const speedInMsPerFloor = 2000;
    const totalMoveTime = numbersOfFloorsToMove * speedInMsPerFloor;

    const firstTimePassedMs = getRandomNumber(0, totalMoveTime);
    const expectedFirstProgress = firstTimePassedMs / totalMoveTime;

    const elevator = getElevator({
      currentFloor,
      targetFloor,
      isMoving: true,
      speedInMsPerFloor,
    });
    const elevatorContext = getElevatorContext([elevator]);

    const elevatorService = new ElevatorService(elevatorContext);
    elevatorService.updateProgress(firstTimePassedMs);

    expect(elevatorContext.getElevators()[0].progress).toBe(
      expectedFirstProgress,
    );
  });

  it("should reset values on arrival", () => {
    const elevator = getElevator({
      currentFloor: 0,
      targetFloor: 2,
      progress: 0.3,
      isMoving: true,
      id: "1",
    });
    const elevatorContext = getElevatorContext([elevator]);
    const elevatorService = getElevatorService([elevator]);

    elevatorService.arriveAtFloor(elevatorContext.getElevators()[0].id);

    expect(elevator.currentFloor).toBe(2);
    expect(elevator.progress).toBe(0);
    expect(elevator.targetFloor).toBeNull();
    expect(elevator.isMoving).toBeFalsy();
  });

  it("should arrive when progress is complete", () => {
    const elevator = getElevator({
      currentFloor: 0,
      targetFloor: 2,
      speedInMsPerFloor: 2000,
      isMoving: true,
      progress: 0,
    });
    const elevatorService = getElevatorService([elevator]);

    elevatorService.updateProgress(2000);

    expect(elevator.progress).toBe(0.5);

    elevatorService.updateProgress(2001);

    expect(elevator.currentFloor).toBe(2);
    expect(elevator.progress).toBe(0);
    expect(elevator.targetFloor).toBeNull();
    expect(elevator.isMoving).toBeFalsy();
  });

  it("should calculate where the elevator is located", () => {
    const elevator = getElevator({
      currentFloor: 2,
      targetFloor: 4,
      speedInMsPerFloor: 2000,
      isMoving: true,
      progress: 0.25,
    });
    const elevatorService = getElevatorService([elevator]);

    const elevatorPositionRelativeToCurrentFloor =
      elevatorService.getElevatorPosition(elevator.id);

    expect(elevatorPositionRelativeToCurrentFloor).toBeTruthy();

    const targetFloor = elevator.targetFloor || 0;
    const expectedPosition =
      (targetFloor - elevator.currentFloor) * elevator.progress +
      elevator.currentFloor;

    expect(elevatorService.getElevatorPosition(elevator.id)).toBe(
      expectedPosition,
    );
  });

  it("should queue a floor when no elevator is available", () => {
    const elevator = getElevator({
      currentFloor: 3,
      isMoving: true,
      targetFloor: 2,
      id: "1",
    });
    const elevatorService = getElevatorService([elevator]);
    const floor = 1;

    elevatorService.callElevator(floor);

    expect(elevatorService.isFloorQueued(floor)).toBeTruthy();
  });

  it("should call an elevator to the next floor in queue", () => {
    const elevator = getElevator({
      currentFloor: 3,
      isMoving: true,
      targetFloor: 2,
      id: "1",
    });
    const elevatorService = getElevatorService([elevator]);
    const floor = 1;

    elevatorService.callElevator(floor);

    expect(elevatorService.isFloorQueued(floor)).toBeTruthy();

    elevatorService.arriveAtFloor(elevator.id);
    elevatorService.callToNextInQueue(elevator.id);

    expect(elevatorService.isFloorQueued(floor)).toBeFalsy();
  });

  it("should call set callback when an elevator arrives", () => {
    const elevator = getElevator({
      isMoving: true,
      targetFloor: 2,
      currentFloor: 1,
    });
    const elevatorService = getElevatorService([elevator]);
    const onArrive = vi.fn();

    elevatorService.onArrive(onArrive);

    elevatorService.arriveAtFloor(elevator.id);

    expect(onArrive).toHaveBeenCalledWith(elevator.id);
  });
});

function getElevatorService(elevators: Elevator[]): ElevatorService {
  return new ElevatorService(getElevatorContext(elevators));
}

function getElevatorContext(elevators: Elevator[]): IElevatorContext {
  return {
    getElevators: () => elevators,
  };
}
