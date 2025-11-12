<script>

  let { id, size, orientation, selected, onSelect } = $props();

  function handleClick() {
    onSelect(id);
  }
</script>

<div class="piece">
  <div class="piece-content">
    {#each Array(size) as _, i}
      <div class= 'piece-content-cell {orientation} {selected ? 'selected' : ''}' onclick={handleClick}>
        {i}
      </div>
    {/each}
  </div>
</div>

<style>
  .piece {
    width: 40px;
    height: 40px;
    display: flex;
  }
  .piece-content {
    display: flex;
  }
  .piece-content-cell {
    width: 40px;
    height: 40px;
    border: 1px solid black;
    background-color: #363636;
  }
  .selected {
    background-color: #def705;
  }
  .horizontal {
    flex-direction: row;
  }
  .vertical {
    flex-direction: column;
  }
</style>