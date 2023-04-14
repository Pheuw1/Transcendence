<script lang="ts">
  import { GAME_EVENTS } from "./constants";
  import { Game } from "./Game";
  import GameCreation from "./GameCreation.svelte";
  import GameComponent from "./GameComponent.svelte";
  import type { StringDto } from "./dtos/StringDto";
  import Matchmaking from "./Matchmaking.svelte";
  import type { MatchmakingDto } from "./dtos/MatchmakingDto";
  import { getUser, store } from "../../Auth";
  import ColorPicker from "./ColorPicker.svelte";
  import { APPSTATE } from "../../App.svelte";
  import { io, Socket } from "socket.io-client";
  import type { GameUpdate } from "./dtos/GameUpdate";
  import type { GameInfo } from "./dtos/GameInfo";
  import { popup } from "../Alert/content";
  import Alert from "../Alert/Alert.svelte";
  import { bind } from 'svelte-simple-modal';

  export function inviteToGame(event: CustomEvent<string>) {
    setAppState(APPSTATE.CREATE_GAME);
    invitedUsername = event.detail;
  }

  export function resetGameConnection() {
    connected = false;
    loggedIn = false;
    failedGameLogIn = false;
    setupSocket(renderCanvas, canvas, context);
  }

  export let appState: string;
  export let setAppState: (newState: APPSTATE | string) => void;

  const SERVER_URL = `http://${import.meta.env.VITE_HOST}:${
    import.meta.env.VITE_BACK_PORT
  }`;

  export let gamePlaying: boolean;
  let connected: boolean = false;
  let loggedIn: boolean = false;
  export let failedGameLogIn: boolean = false;
  let socket: Socket;
  let elementsColor: string = "#FFFFFF";
  let backgroundColor: string = "#000000";
  let game: Game;
  let renderCanvas: HTMLCanvasElement;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let invitedUsername: string = "";

  function setupSocket(
    _renderCanvas: HTMLCanvasElement,
    _canvas: HTMLCanvasElement,
    _context: CanvasRenderingContext2D
  ) {
    socket = io(SERVER_URL);
    renderCanvas = _renderCanvas;
    canvas = _canvas;
    context = _context;
    game = new Game(
      _renderCanvas,
      canvas,
      context,
      elementsColor,
      backgroundColor
    );

    socket.on("connect", onSocketOpen);
    socket.on("disconnect", onSocketClose);
    socket.on(GAME_EVENTS.START_GAME, () => {
      game.start(socket);
    });
    socket.on(GAME_EVENTS.GAME_TICK, (data: GameUpdate) => {
      game.update(data);
    });
    socket.on(GAME_EVENTS.GET_GAME_INFO, (data: GameInfo) => {
      if (data && data.gameId != game.id) {
        if (gamePlaying && data.gameId == "") {
          resetMenus();
          gamePlaying = false;
        }
        if (data.yourPaddleIndex !== -2) {
          gamePlaying = true;
          game.ranked = data.ranked;
          game.setInfo(data);
        }
      }
    });
    socket.on(GAME_EVENTS.REGISTER_PLAYER, (succeeded: boolean) => {
      if (succeeded) {
        loggedIn = true;
        setInterval(() => {
          updateGameInfo();
        }, 1000);
      } else {
        failedGameLogIn = true;
      }
    });
    socket.on(GAME_EVENTS.CREATE_GAME, (succeeded: boolean) => {
      if (succeeded) {
        gamePlaying = true;
      } else {
        gamePlaying = false;
        popup.set(bind(Alert, { message: "Failed to invite user. Is he currently connected to the game?", form: false }))
      }
    });
    socket.on(GAME_EVENTS.MATCHMAKING, (data: MatchmakingDto) => {
      if (data.matchmaking && appState !== APPSTATE.MATCHMAKING) {
        setAppState(APPSTATE.MATCHMAKING);
      } else if (!data.matchmaking && appState === APPSTATE.MATCHMAKING) {
        setAppState(APPSTATE.HOME);
      }
    });
    socket.on(GAME_EVENTS.READY, (succeeded: boolean) => {
      game.youAreReady = succeeded;
    });
  }

  async function onSocketOpen() {
    await getUser();
    void logIn();
    connected = true;
  }

  async function onSocketClose() {
    connected = false;
    setupSocket(renderCanvas, canvas, context);
  }

  function updateGameInfo() {
    socket.emit(GAME_EVENTS.GET_GAME_INFO);
  }

  async function logIn() {
    const data: { playerName: StringDto; socketKey: StringDto } = {
      playerName: { value: $store.username },
      socketKey: { value: $store.socketKey },
    };
    socket.emit(GAME_EVENTS.REGISTER_PLAYER, data);
  }

  function startMatchmaking() {
    const data: MatchmakingDto = { matchmaking: true };
    socket.emit(GAME_EVENTS.MATCHMAKING, data);
  }

  function stopMatchmaking() {
    const data: MatchmakingDto = { matchmaking: false };
    socket.emit(GAME_EVENTS.MATCHMAKING, data);
  }

  function resetMenus() {
    setAppState(APPSTATE.HOME);
    game.youAreReady = false;
  }

  $: {
    if (game !== undefined) {
      game.updateColors(elementsColor, backgroundColor);
    }
  }

  $: {
    if (socket && socket.connected) {
      if (appState === APPSTATE.MATCHMAKING) {
        startMatchmaking();
      } else if (appState !== APPSTATE.MATCHMAKING) {
        stopMatchmaking();
      }
    }
  }
</script>

<main>
  <GameComponent {game} {gamePlaying} {setupSocket} {socket} />
  {#if gamePlaying}
    <div />
  {:else if loggedIn}
    <h1>Choose a gamemode</h1>
    <button on:click={startMatchmaking}>Matchmaking</button>
    <button on:click={() => setAppState(APPSTATE.CREATE_GAME)}
      >Play with a friend</button
    >
    <div>
      <h3>Color your game!</h3>
      <div>
        <label class="color-label" for="colorPicker">Elements color:</label>
        <ColorPicker bind:color={elementsColor} />
      </div>
      <div>
        <label class="color-label" for="colorPicker">Background color:</label>
        <ColorPicker bind:color={backgroundColor} />
      </div>
    </div>
    {#if appState === APPSTATE.MATCHMAKING}
      <div on:click={stopMatchmaking} on:keydown={stopMatchmaking}>
        <Matchmaking {stopMatchmaking} />
      </div>
    {:else if appState === APPSTATE.CREATE_GAME}
      <div
        on:click={() => setAppState(APPSTATE.HOME)}
        on:keydown={() => setAppState(APPSTATE.HOME)}
      >
        <GameCreation {socket} {invitedUsername} />
      </div>
    {/if}
  {:else if !connected}
    Connecting to game server...
  {:else if failedGameLogIn}
    Failed to log in to game server. Do you have multiple pages open at the same
    time? If yes, please close them and try again.
  {:else if !loggedIn}
    Logging in to game server...
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    max-height: 80vh;
  }

  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }

  button {
    font-size: 1.5rem;
    padding: 1rem 2rem;
    margin-bottom: 1rem;
  }

  .color-label {
    display: inline;
  }
</style>
