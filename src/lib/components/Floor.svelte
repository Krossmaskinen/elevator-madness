<script lang="ts">
  const {
    callElevator,
    floorNumber,
    hasInboundElevator,
    hasElevator,
    hasElevatorInQueue,
  } = $props();
</script>

<div class="flex flex-row justify-between w-16">
  <div class="w-5">{floorNumber}</div>
  <div class="w-5">
    <button
      class="disabled:opacity-50 not-disabled:cursor-pointer"
      onclick={() => callElevator(floorNumber)}
      disabled={hasInboundElevator || hasElevator || hasElevatorInQueue}
      >🔘</button
    >
  </div>
  <div class="w-5">
    {#if hasInboundElevator}
      🟡
    {:else if hasElevator}
      🟢
    {:else if hasElevatorInQueue}
      🟠
    {:else}
      ⚪
    {/if}
  </div>
</div>
