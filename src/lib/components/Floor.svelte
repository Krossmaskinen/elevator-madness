<script lang="ts">
  const { callElevator, floorNumber, isDisabled, icon } = $props();
</script>

<div class="flex flex-row justify-between w-16">
  <div class="w-5">{floorNumber}</div>
  <div class="w-5">
    <button
      class="disabled:opacity-50 not-disabled:cursor-pointer"
      onclick={() => callElevator(floorNumber)}
      disabled={isDisabled}>🔘</button
    >
  </div>
  <div class="w-5">
    <span>{icon}</span>
  </div>
</div>
