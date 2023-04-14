<script lang="ts" context="module">
  export interface Player {
    username: string;
    wins: number;
    looses: number;
    matchs: number;
    winrate: number;
    rank: number;
    twoFA: boolean;
    ftId: number;
  }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { bind } from 'svelte-simple-modal';
  import { API_URL, store, logout } from "../Auth";
  import Alert from "./Alert/Alert.svelte";
  import { popup } from "./Alert/content";

  export let username: string = $store.username;
  export let gamePlaying: boolean;
  export let resetGameConnection: () => void = () => {};

  let edit: boolean = true;
  let user: Player = $store;
  let newUsername: string = $store.username;

  let avatarForm: HTMLFormElement;

  async function getUser() {
    if (username !== $store.username) {
      edit = false;
      let res = await fetch(API_URL + "/users/" + username + "/byname", {
        mode: "cors",
      });
      user = await res.json();
    }
  }

  onMount(() => {
    getUser();
  });

  const dispatch = createEventDispatcher();
  async function handleSubmit() {
    if (gamePlaying) {
      popup.set(bind(Alert, { message: "Cannot change username while playing.", form: false }))
      return;
    }
    if ($store.username === newUsername) {
      popup.set(bind(Alert, { message: `Username is already set to ${newUsername}.`, form: false }))
      return;
    }

    let response = await fetch(API_URL + "/users", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({ username: newUsername }),
      credentials: "include",
    });
    if (response.ok) {
      $store.username = newUsername;
      username = newUsername;
      popup.set(bind(Alert, { message: "Succefully changed username.", form: false }))
      resetGameConnection();
    }
  }

  async function handle2fa(event: Event) {
    event.preventDefault();
    user.twoFA = !user.twoFA;
    let response = await fetch(API_URL + "/users", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(user),
      credentials: "include",
    });
    if (response.ok) {
      popup.set(bind(Alert, {
        message: "Succefully " + (user.twoFA ? "enabled" : "disabled") + " 2FA",
        form : false
      }))
    }
  }
</script>

<div class="overlay">
  <div class="profile" on:click|stopPropagation on:keydown|stopPropagation>
    <h3>===| <mark>{username}'s Profile</mark> |===</h3>
    <div class="profile-header">
      {#if !edit}
        <img src={`${API_URL}/users/${user.ftId}/avatar`} alt="avatar" class="profile-img" />
      {:else}
        <form
          action={`${API_URL}/users/avatar`}
          method="post"
          enctype="multipart/form-data"
          bind:this={avatarForm}
        >
          <input
            type="file"
            id="avatar-input"
            name="avatar"
            accept="image/png, image/gif, image/jpeg"
            on:change={() => avatarForm.submit()}
          />
        </form>
        <label class="img-class" for="avatar-input">
          <img
            src={API_URL + "/users/avatar"}
            alt="avatar"
            class="profile-img"
          />
        </label>
      {/if}
    </div>
    <div class="profile-body">
      <p>
        <button on:click={() => dispatch("view-history")}
          >View History</button
        >
      </p>
      <p>Wins: {user.wins}</p>
      <p>Looses: {user.looses}</p>
      <p>Winrate: {user.winrate.toFixed(2)}%</p>
      <p>Rank: {user.rank}</p>
    </div>
    {#if edit}
      <form
        id="username-form"
        class="username"
        on:submit|preventDefault={handleSubmit}
      >
        <input type="text" id="username" bind:value={newUsername} required/>
        <button type="submit" class="username" form="username-form"
          >Change</button
        >
      </form>
      <button type="button" on:click={handle2fa}>
        {#if user.twoFA}
          Disable 2FA
        {:else}
          Enable 2FA
        {/if}
      </button>
      <button id="logout" type="button" on:click={logout}>Log Out</button>
    {/if}
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

  .profile {
    background-color: #343a40;
    border: 1px solid #495057;
    border-radius: 5px;
    padding: 1rem;
    max-width: 80%;
    max-height: 80vh;
    overflow: auto;
    width: 375px;
    color: #e8e6e3;
  }

  .profile-header {
    display: flex;
    align-items: center;
  }

  .profile-header {
    margin: auto;
    justify-content: center;
  }

  .profile-img {
    max-width: 80%;
    width: 256px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  #avatar-input {
    display: none;
  }

  .profile > h3 {
    display: flex;
    justify-content: center;
  }

  .profile-body > p {
    display: flex;
    justify-content: center;
  }

  .username {
    text-align: center;
  }

  #logout {
    float: right;
  }

  mark {
    background-color: #198754;
    padding: 0 0.2rem;
    color: #e8e6e3;
  }

  button {
    background-color: #198754;
    border: none;
    color: #e8e6e3;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease-in-out;
    outline: none;
    margin: 0.5rem;
  }

  button:hover {
    background-color: #157347;
  }

  button:focus {
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.25);
  }
</style>
