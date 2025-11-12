<script>

  let { onOrientationChange } = $props();

  function handleClick() {
    onOrientationChange();
  }
</script>

<button onclick={handleClick}>
  Change Orientation
</button>

<style>
  button {
    background-color: #363636;
    color: white;
    border: 1px solid black;
  }
</style>