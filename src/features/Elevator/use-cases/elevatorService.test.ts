import { getElevator, getRandomNumber } from "../public/data-generator";
import type { IElevatorContext } from "../interfaces/elevatorContext";
import type { Elevator } from "../types";
import { ElevatorService } from "./elevatorService";

describe("ElevatorService", () => {
	it("should call the elevator to a specific floor", () => {
		const elevator = getElevator({ currentFloor: 0 });
		const elevatorContext = getElevatorContext([elevator]);

		const elevatorService = new ElevatorService(elevatorContext);
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
		const elevatorService = new ElevatorService(elevatorContext);

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
		const elevatorContext = getElevatorContext([elevator]);
		const elevatorService = new ElevatorService(elevatorContext);

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
		const elevatorContext = getElevatorContext([elevator]);
		const elevatorService = new ElevatorService(elevatorContext);

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

	it("should find the closest elevator to a floor", () => {
		const elevator1 = getElevator({ currentFloor: 0, id: "1" });
		const elevator2 = getElevator({ currentFloor: 5, id: "2" });
		const elevator3 = getElevator({ currentFloor: 10, id: "3" });
		const elevatorContext = getElevatorContext([
			elevator1,
			elevator2,
			elevator3,
		]);
		const elevatorService = new ElevatorService(elevatorContext);

		const closestElevatorToFloor4 =
			elevatorService.getClosestElevatorToFloor(4);
		expect(closestElevatorToFloor4?.id).toBe("2");

		const closestElevatorToFloor9 =
			elevatorService.getClosestElevatorToFloor(9);
		expect(closestElevatorToFloor9?.id).toBe("3");

		const closestElevatorToFloor1 =
			elevatorService.getClosestElevatorToFloor(1);
		expect(closestElevatorToFloor1?.id).toBe("1");
	});

	it("should see if a floor has an inbound elevator", () => {
		const targetFloor = getRandomNumber(0, 10);
		const elevator = getElevator({
			currentFloor: 0,
			isMoving: true,
			targetFloor,
			id: "1",
		});
		const elevatorContext = getElevatorContext([elevator]);
		const elevatorService = new ElevatorService(elevatorContext);

		expect(elevatorService.getInboundElevator(targetFloor)).toBe("1");
	});

	it("should see if a floor has an elevator", () => {
		const currentFloor = getRandomNumber(0, 10);
		const elevator = getElevator({
			currentFloor,
			isMoving: false,
			targetFloor: null,
			id: "1",
		});
		const elevatorContext = getElevatorContext([elevator]);
		const elevatorService = new ElevatorService(elevatorContext);

		expect(elevatorService.getElevatorOnFloor(currentFloor)).toBe("1");

		elevator.isMoving = true;
		expect(elevatorService.getElevatorOnFloor(currentFloor)).toBeFalsy();

		elevator.isMoving = false;
		elevator.currentFloor = 11;
		expect(elevatorService.getElevatorOnFloor(currentFloor)).toBeFalsy();
	});
});

function getElevatorContext(elevators: Elevator[]): IElevatorContext {
	return {
		getElevators: () => elevators,
	};
}
