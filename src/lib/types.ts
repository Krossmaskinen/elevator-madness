export interface Elevator {
  id: string;
  currentFloor: number;
  targetFloor: number | null;
  isMoving: boolean;
  progress: number;
  speedInMsPerFloor: number;
}

export interface FloorViewModel {
  floorNumber: number;
  isDisabled: boolean;
  icon: string;
}
