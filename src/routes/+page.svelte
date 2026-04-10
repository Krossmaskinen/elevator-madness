<script lang="ts">
  import { GameLoop } from "$lib/adapters/game-loop/gameLoopAdapter";
  import { getElevator } from "../features/Elevator/public/data-generator";
  import { ElevatorService } from "../features/Elevator/public";
  import { ElevatorView } from "../features/Elevator/public";
  import {
    getElevatorOnFloor,
    hasInboundElevator,
  } from "$lib/utils/elevatorUtils";
  import { getRandomNumber } from "$lib/utils/data-generator";
  import { getFloors } from "$lib/utils/floorUtils";
  import type { Elevator } from "$lib/types";

  const settings = {
    numberOfFloors: 20,
    floorHeight: 2, // spacing
    refreshRateMs: 16,
  };
  const floors: number[] = getFloors(settings.numberOfFloors);
  const elevators = $state(Array(5).fill(null).map(getElevator));
  const elevatorContext = {
    getElevators: () => elevators,
  };
  const elevatorService = new ElevatorService(elevatorContext);
  const gameLoop = new GameLoop({ updateInterval: settings.refreshRateMs });

  elevatorService.onArrive((elevatorId: string) => {
    if (elevatorService.hasQueuedFloors()) {
      elevatorService.callToNextInQueue(elevatorId);
    }
  });

  gameLoop.start((deltaTime: number) => {
    elevatorService.updateProgress(deltaTime);
  });

  function callRandomFloors(amount: number, elevators: Elevator[]) {
    const calledElevators = [NaN];
    let failedAttempts = 0;

    for (let i = 0; i < amount; ++i) {
      let floorToCall = NaN;
      let floorIsValid = false;

      while (!floorIsValid && failedAttempts < settings.numberOfFloors) {
        floorToCall = getRandomNumber(1, settings.numberOfFloors);

        floorIsValid =
          !calledElevators.includes(floorToCall) &&
          !getElevatorOnFloor(floorToCall, elevators) &&
          !hasInboundElevator(floorToCall, elevators);

        if (!floorIsValid) {
          ++failedAttempts;
        }
      }

      elevatorService.callElevator(floorToCall);
      calledElevators.push(floorToCall);
    }
  }
</script>

<ElevatorView
  {floors}
  {elevators}
  {elevatorService}
  {settings}
  onCallRandom={() => callRandomFloors(5, elevatorContext.getElevators())}
/>
