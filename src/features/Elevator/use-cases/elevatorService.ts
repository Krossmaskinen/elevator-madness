import type { IElevatorContext } from "../interfaces/elevatorContext";
import type { Elevator } from "../types";

export class ElevatorService {
  private elevatorContext: IElevatorContext;

  constructor(elevatorContext: IElevatorContext) {
    this.elevatorContext = elevatorContext;
  }

  public callElevator(floor: number): void {
    const elevator = this.getClosestElevatorToFloor(floor);

    if (this.getElevatorExists(elevator)) {
      if (elevator.isMoving || elevator.targetFloor) {
        return;
      }

      elevator.targetFloor = floor;
      elevator.isMoving = true;
    }
  }

  public arriveAtFloor(id: string): void {
    const elevator = this.getElevator(id);

    if (this.getElevatorExists(elevator)) {
      elevator.currentFloor = elevator.targetFloor ?? elevator.currentFloor;
      elevator.targetFloor = null;
      elevator.isMoving = false;
      elevator.progress = 0;
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
        
        const floorsToMove = Math.abs(elevator.targetFloor - elevator.currentFloor);
        const totalMoveTime = floorsToMove * elevator.speedInMsPerFloor;
        const progressSinceLast = Math.min((deltaTimeMs / totalMoveTime));
        
        elevator.progress += progressSinceLast;

        if (elevator.progress >= 1) {
          this.arriveAtFloor(elevator.id)
        }
      }
    }
  }

  public getElevatorPosition = (id: string) => {
    const elevator = this.getElevator(id)

    if (this.getElevatorExists(elevator)) {
      if (!elevator.targetFloor) {
        return elevator.currentFloor;
      }

      const position = ((elevator.targetFloor - elevator.currentFloor) * elevator.progress) + elevator.currentFloor;
      return position; 
    }

    return 0;
  }

  public getClosestElevatorToFloor(floor: number) {
    let closestElevator: Elevator | undefined;
    let closestDistance = NaN;

    this.elevatorContext.getElevators().forEach((elevator) => {
      if (elevator.isMoving || closestDistance <= 1) {
        return;
      }

      if (closestElevator) {
        const distance = Math.abs(elevator.currentFloor - floor);

        if (distance < closestDistance) {
          closestElevator = elevator;
          closestDistance = distance;
        }
      } else {
        closestElevator = elevator;
        closestDistance = Math.abs(elevator.currentFloor - floor);
      }
    })

    return closestElevator;
  }

  public getInboundElevator = (floor: number): string | undefined => {
    return this.elevatorContext.getElevators().find(el => el.targetFloor === floor)?.id;
  }

  public getElevatorOnFloor = (floor: number): string | undefined => {
    return this.elevatorContext.getElevators().find(el => el.currentFloor === floor && !el.isMoving)?.id;
  }
    
  private getElevator(id: string): Elevator | undefined {
    return this.elevatorContext.getElevators().find(elevator => elevator.id === id);
  }

  private getElevatorExists(elevator: Elevator | undefined): elevator is Elevator {
    if (!elevator) {
      console.log("Elevator not found.");
      return false;
    }
    return true;
  }
}