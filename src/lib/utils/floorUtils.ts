import type { FloorViewModel } from "$lib/types";

export function getFloorViewModel({
  hasElevator,
  hasInboundElevator,
  isQueued,
  floorNumber,
}: {
  hasElevator: boolean;
  hasInboundElevator: boolean;
  isQueued: boolean;
  floorNumber: number;
}): FloorViewModel {
  let icon = "⚪";

  if (hasElevator) {
    icon = "🟢";
  } else if (hasInboundElevator) {
    icon = "🟡";
  } else if (isQueued) {
    icon = "🟠";
  }

  return {
    isDisabled: hasElevator || hasInboundElevator || isQueued,
    floorNumber,
    icon,
  };
}

export function getFloors(amount: number) {
  const floorNumbers: number[] = [];

  for (let i = amount; i >= 1; i--) {
    floorNumbers.push(i);
  }
  return floorNumbers;
}
