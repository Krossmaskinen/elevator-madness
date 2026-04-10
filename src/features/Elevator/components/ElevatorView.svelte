<script lang="ts">
  import Floor from "$lib/components/Floor.svelte";
  import type { Elevator, FloorViewModel } from "$lib/types";
  import {
    hasInboundElevator,
    getElevatorOnFloor,
  } from "$lib/utils/elevatorUtils";
  import { getFloorViewModel } from "$lib/utils/floorUtils";
  import SingleElevator from "./SingleElevator.svelte";
  import type { ElevatorService } from "../use-cases/elevatorService";

  interface Props {
    floors: number[];
    elevators: Elevator[];
    elevatorService: ElevatorService;
    settings: { floorHeight: number };
    onCallRandom: () => void;
  }
  const { floors, elevators, elevatorService, settings, onCallRandom }: Props =
    $props();

  const floorViewModels: FloorViewModel[] = $derived(
    floors.map((floor) =>
      getFloorViewModel({
        floorNumber: floor,
        hasInboundElevator: hasInboundElevator(floor, elevators),
        hasElevator: !!getElevatorOnFloor(floor, elevators),
        isQueued: elevatorService.isFloorQueued(floor),
      }),
    ),
  );
</script>

<div class="container max-w-1/2 mx-auto flex flex-col items-center gap-4 py-4">
  <h1 class="text-bold text-2xl">Elevator Madness</h1>
  <p>
    Press a button on a floor to call an elevator. Or press the button below
    and...
  </p>
  <button
    class="border border-black bg-amber-300 p-1 rounded cursor-pointer hover:bg-amber-400"
    onclick={onCallRandom}
  >
    <span>⚠️ Go crazy</span>
  </button>

  <div class="flex justify-start mt-4">
    <div
      class="flex flex-col h-80vh px-2 border-solid border-black border-2"
      id="floors"
    >
      {#each floorViewModels as floor (floor.floorNumber)}
        <div class="h-8">
          <Floor
            {...floor}
            callElevator={(floorNumber: number) => {
              elevatorService.callElevator(floorNumber);
            }}
          />
        </div>
      {/each}
    </div>
    <div
      class="flex flex-row h-80vh relative w-30 border-solid border-black border-2"
      id="elevators"
    >
      {#each elevators as elevator, index (elevator.id)}
        <div
          class="h-8 absolute"
          style="left: {index *
            20}%; bottom: {(elevatorService.getElevatorPosition(elevator.id) -
            1) *
            settings.floorHeight}rem"
        >
          <SingleElevator />
        </div>
      {/each}
    </div>
  </div>
</div>
