<script lang="ts">
  import { Map } from "./Map";
  import {
    DEFAULT_BALL_INITIAL_SPEED,
    DEFAULT_MAP_SIZE,
    DEFAULT_MAX_BALL_SPEED,
    GAME_EVENTS,
  } from "./constants";
  import MapCustomization from "./MapCustomization.svelte";
  import type { GameCreationDto } from "./dtos/GameCreationDto";
  import { store } from "../../Auth";
  import type { Socket } from "socket.io-client";

  export let socket: Socket;
  export let invitedUsername: string;

  let map: Map = new Map(DEFAULT_MAP_SIZE.clone(), []);
  let initialBallSpeedX: number = DEFAULT_BALL_INITIAL_SPEED.x;
  let initialBallSpeedY: number = DEFAULT_BALL_INITIAL_SPEED.y;

  function createGame() {
    const data: GameCreationDto = {
      playerNames: [$store.username, invitedUsername],
      map,
      initialBallSpeedX,
      initialBallSpeedY,
    };
    socket.emit(GAME_EVENTS.CREATE_GAME, data);
  }
</script>

<div class="overlay">
  <div class="window" on:click|stopPropagation on:keydown|stopPropagation>
    Friend:
    <input class="name-input" bind:value={invitedUsername} />
    <button on:click={createGame} disabled={invitedUsername === undefined || invitedUsername === ''}>
      Create game vs {invitedUsername}
    </button>
    <div>
      <span>Initial ball's speed (X): {initialBallSpeedX}</span>
      <br />
      <input
        type="range"
        bind:value={initialBallSpeedX}
        min={DEFAULT_BALL_INITIAL_SPEED.x}
        max={DEFAULT_MAX_BALL_SPEED.x}
      />
      <br />
      <span>Initial ball's speed (Y): {initialBallSpeedY}</span>
      <br />
      <input
        type="range"
        bind:value={initialBallSpeedY}
        min={DEFAULT_BALL_INITIAL_SPEED.y}
        max={DEFAULT_MAX_BALL_SPEED.y}
      />
    </div>
    <MapCustomization {map} />
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
    width: 50vw;
    max-width: 80vw;
    max-height: 80vh;
    overflow: auto;
  }

  .name-input {
    max-width: 100%;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .window {
      width: 80vw;
    }
  }
</style>
