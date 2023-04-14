<script lang="ts">
  export let stopMatchmaking: () => void;
</script>

<div class="overlay">
  <div class="window" on:click|stopPropagation on:keydown|stopPropagation>
    <h1>Matchmaking...</h1>
    <button on:click={stopMatchmaking}>Cancel</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .window {
    background-color: #343a40;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    max-width: 80vw;
    max-height: 80vh;
    overflow: auto;
  }
</style>
