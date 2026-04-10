<script lang="ts">
  import { GameLoop } from "$lib/adapters/game-loop/gameLoopAdapter";
  import {
    getElevator,
    getRandomNumber,
  } from "../features/Elevator/public/data-generator";
  import { ElevatorService } from "../features/Elevator/public";
  import ElevatorView from "../features/Elevator/public/ElevatorView.svelte";

  const settings = {
    numberOfFloors: 10,
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

  gameLoop.start((deltaTime: number) => {
    elevatorService.updateProgress(deltaTime);
  });

  function getFloors(amount: number) {
    let floorNumbers: number[] = [];

    for (let i = amount; i >= 1; i--) {
      floorNumbers.push(i);
    }
    return floorNumbers;
  }

  function callRandomFloors(amount: number) {
    const calledElevators = [NaN];

    for (let i = 0; i < amount; ++i) {
      let floorToCall = NaN;
      let floorIsValid = false;

      while (!floorIsValid) {
        floorToCall = getRandomNumber(1, settings.numberOfFloors);

        floorIsValid =
          !calledElevators.includes(floorToCall) &&
          !elevatorService.getElevatorOnFloor(floorToCall) &&
          !elevatorService.getInboundElevator(floorToCall);
      }

      console.log(`valid floor ${floorToCall}`);

      elevatorService.callElevator(floorToCall);

      console.log(
        `selected elevator ${elevatorService.getInboundElevator(floorToCall)}`,
      );
      calledElevators.push(floorToCall);
    }
  }
</script>

<ElevatorView
  {floors}
  {elevators}
  {elevatorService}
  {settings}
  onCallRandom={() => callRandomFloors(5)}
/>
