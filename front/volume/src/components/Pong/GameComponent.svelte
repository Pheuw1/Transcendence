<script lang="ts">
  import type { Socket } from "socket.io-client";
  import { onMount } from "svelte";
    import { API_URL, getUser } from "../../Auth";
  import { GAME_EVENTS } from "./constants";
  import type { Game } from "./Game";

  export let gamePlaying: boolean;
  export let setupSocket: (
    renderCanvas: HTMLCanvasElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => void;
  export let socket: Socket;
  export let game: Game;

  let gameCanvas: HTMLCanvasElement;
  let renderCanvas: HTMLCanvasElement;
  let gameUsers: any[] = [];

  onMount(() => {
    if (gameCanvas && renderCanvas) {
      const context: CanvasRenderingContext2D = gameCanvas.getContext("2d");
      if (context) {
        setupSocket(renderCanvas, gameCanvas, context);
      }
    }
  });

  $: {
    if (game && game.players.length > 1) {
      void getGameUsers();
    }
  }

  async function getGameUsers() {
    gameUsers = [];
    for (const player of game.players) {
      console.log(player.name)
      const response = await fetch(API_URL + "/users/" + player.name + "/byname", {
        credentials: "include",
        method: "GET",
        mode: "cors",
      })
      if (response.ok) {
        const user = await response.json()
        gameUsers.push(user);
      }
    }
    gameUsers = gameUsers;
  }
</script>

<div hidden={!gamePlaying}>
  {#if game && !game.ranked}
    <button on:click={() => socket.emit(GAME_EVENTS.LEAVE_GAME)}>Leave</button>
    <button
      disabled={game.youAreReady}
      on:click={() => socket.emit(GAME_EVENTS.READY)}>Ready</button
    >
  {/if}
  {#if gameUsers.length > 1}
    <div class="game-header">
      <div class="empty-header-space" />
      <div class="user-header">
        <img alt="avatar" src={API_URL + '/users/' + gameUsers[0].ftId + '/avatar' } />
        <p>
          {gameUsers[0].username}
          <br />
          ({(gameUsers[0].winrate).toFixed(1)} WR%)
        </p>
      </div>
      <div class="vs">
        VS
      </div>
      <div class="user-header">
        <img alt="avatar" src={API_URL + '/users/' + gameUsers[1].ftId + '/avatar' } />
        <p>
          {gameUsers[1].username}
          <br />
          ({(gameUsers[1].winrate).toFixed(1)} WR%)
        </p>
      </div>
      <div class="empty-header-space" />
    </div>
  {/if}

  <canvas hidden bind:this={gameCanvas} />
  <canvas bind:this={renderCanvas} class="renderCanvas" />
</div>

<style>
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8em;
    text-align: center;
    overflow: auto;
    max-height: 80vh;
  }

  .user-header {
    flex: 1;
  }
  
  .user-header img {
    position: relative;
    height: 50px;
    margin-right: 10px;
  }

  .empty-header-space {
    flex: 1;
  }

  .vs {
    flex: 2;
    grid-area: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
  }

  .renderCanvas {
    display: block;
    width: 80vw;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    max-height: 70vh;
    touch-action: none;
    object-fit: contain;
  }
</style>
