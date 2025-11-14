<script>
  let { status } = $props();

</script>

<div class="game-status">
  <p>{status}</p>
</div>

<style>
  .game-status {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #00008B;
  }
</style>