export enum FLOOR_STATUS {
	HAS_INBOUND = "HAS_INBOUND",
	HAS_ELEVATOR = "HAS_ELEVATOR",
}

export interface FloorViewModel {
	floorNumber: number;
	isDisabled: boolean;
	icon: string;
}