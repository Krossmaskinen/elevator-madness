export interface Elevator {
  id: string;
  currentFloor: number;
  targetFloor: number | null;
  isMoving: boolean;
  progress: number;
  speedInMsPerFloor: number;
}