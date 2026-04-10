<script lang="ts">
  import Floor from "$lib/components/Floor.svelte";
  import SingleElevator from "../components/SingleElevator.svelte";
  import type { Elevator } from "../types";
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
</script>

<div class="container w-half mx-auto">
  <h1>Elevator Madness</h1>
  <button onclick={onCallRandom}>Go crazy</button>

  <div class="flex justify-start">
    <div
      class="flex flex-col h-80vh px-2 border-solid border-black border-2"
      id="floors"
    >
      {#each floors as floor (floor)}
        <div class="h-8">
          <Floor
            hasInboundElevator={!!elevatorService.getInboundElevator(floor)}
            hasElevator={!!elevatorService.getElevatorOnFloor(floor)}
            floorNumber={floor}
            callElevator={(floorNumber: number) => {
              elevatorService.callElevator(floorNumber);
            }}
            hasElevatorInQueue={false}
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
