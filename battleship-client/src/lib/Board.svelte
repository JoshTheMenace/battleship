<script>
  let { board, onCellClick, onCellHover } = $props();
</script>

<div class="board">
{#each board as row, rowIndex}
<div class="row">
  {#each row as cell, colIndex}
    <div 
      class="cell {cell}"
      onclick={() => onCellClick(rowIndex, colIndex)}
      onmouseover={() => onCellHover(rowIndex, colIndex)}
    >
      {#if cell === 'hit'}❌{/if}
      {#if cell === 'miss'}⚪{/if}
      {#if cell === '1' || cell === '2' || cell === '3' || cell === '4'}🔳{/if}
      {#if cell === 'hover'}🟨{/if}
      {#if cell === 'attack'}🟥{/if}
    </div>
  {/each}
</div>
{/each}
</div>

<style>
  .cell { 
    width: 40px; 
    height: 40px; 
    border: 1px solid black; 
  }
  .hit { background: red; }
  .miss { background: lightblue; }
  .row {
    display: flex;
  }
  .board {
    display: flex;
    flex-direction: column;
  }
</style>