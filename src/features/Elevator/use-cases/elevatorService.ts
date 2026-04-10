import type { Elevator } from "$lib/types";
import { getClosestElevatorToFloor } from "$lib/utils/elevatorUtils";
import { Queue } from "$lib/utils/queue.svelte";
import type { IElevatorContext } from "../interfaces/elevatorContext";

export class ElevatorService {
  private elevatorContext: IElevatorContext;
  private queue: Queue<number>;
  private onArriveCallback: ((id: string) => void) | undefined;

  constructor(elevatorContext: IElevatorContext) {
    this.elevatorContext = elevatorContext;
    this.queue = new Queue<number>();
  }

  public callElevator(floor: number): void {
    const elevatorId = getClosestElevatorToFloor(
      floor,
      this.elevatorContext.getElevators(),
    );

    if (elevatorId) {
      this.callElevatorToFloor(elevatorId, floor);
    } else {
      this.queue.add(floor);
    }
  }

  public arriveAtFloor(id: string): void {
    const elevator = this.getElevator(id);

    if (this.getElevatorExists(elevator)) {
      elevator.currentFloor = elevator.targetFloor ?? elevator.currentFloor;
      elevator.targetFloor = null;
      elevator.isMoving = false;
      elevator.progress = 0;

      this.onArriveCallback?.(elevator.id);
    }
  }

  public updateProgress(deltaTimeMs: number): void {
    for (const elevator of this.elevatorContext.getElevators()) {
      if (this.getElevatorExists(elevator)) {
        if (elevator.targetFloor === null) {
          continue;
        }

        if (!elevator.isMoving) {
          elevator.isMoving = true;
        }

        const floorsToMove = Math.abs(
          elevator.targetFloor - elevator.currentFloor,
        );
        const totalMoveTime = floorsToMove * elevator.speedInMsPerFloor;
        const progressSinceLast = Math.min(deltaTimeMs / totalMoveTime);

        elevator.progress += progressSinceLast;

        if (elevator.progress >= 1) {
          this.arriveAtFloor(elevator.id);
        }
      }
    }
  }

  public getElevatorPosition = (id: string) => {
    const elevator = this.getElevator(id);

    if (this.getElevatorExists(elevator)) {
      if (!elevator.targetFloor) {
        return elevator.currentFloor;
      }

      const position =
        (elevator.targetFloor - elevator.currentFloor) * elevator.progress +
        elevator.currentFloor;
      return position;
    }

    return 0;
  };

  public callToNextInQueue = (id: string) => {
    const nextFloor = this.queue.getNext();

    if (nextFloor) {
      this.callElevatorToFloor(id, nextFloor);
    }
  };

  public isFloorQueued = (floor: number): boolean => {
    return this.queue.hasItem(floor);
  };

  public hasQueuedFloors = (): boolean => {
    return !this.queue.isEmpty();
  };

  public onArrive = (callback: (id: string) => void): void => {
    this.onArriveCallback = callback;
  };

  private callElevatorToFloor = (id: string, floor: number) => {
    const elevator = this.getElevator(id);

    if (this.getElevatorExists(elevator)) {
      elevator.targetFloor = floor;
      elevator.isMoving = true;
    }
  };

  private getElevator(id: string): Elevator | undefined {
    return this.elevatorContext
      .getElevators()
      .find((elevator) => elevator.id === id);
  }

  private getElevatorExists(
    elevator: Elevator | undefined,
  ): elevator is Elevator {
    if (!elevator) {
      return false;
    }
    return true;
  }
}
