<script>
  let { status } = $props();

  let statusText = $derived(status === 'Waiting for opponent...' ? 'Waiting for opponent...' : status === 'playing' ? 'Playing' : status === 'won' ? 'You won!' : 'You lost!');
  let statusColor = $derived(status === 'Waiting for opponent...' ? 'black' : status === 'playing' ? 'black' : status === 'won' ? 'green' : 'red');
</script>

<div class="game-status" style:color={statusColor}>
  <p>{statusText}</p>
</div>

<style>
  .game-status {
    text-align: center;
  }
</style>