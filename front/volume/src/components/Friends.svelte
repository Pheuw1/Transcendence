<script lang="ts" context="module">
  export interface Friend {
    username: string;
    status: "online" | "offline" | "in a game";
    ftId: number;
  }
  export async function addFriend(event: any) {
    console.log(typeof event);

    event.preventDefault();
    const username = event.target
      ? event.target.querySelector('input[type="text"]').value
      : event.detail;

    const response = await fetch(API_URL + "/users/invit/" + username, {
      credentials: "include",
      mode: "cors",
    });
    if (response.ok) {
      show_popup("Invitation send.", false);
    } else {
      const error = (await response.json()).message;
      show_popup("Invitation failed: " + error, false);
    }
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { API_URL, store } from "../Auth";
    import { show_popup } from "./Alert/content";

  let friends: Friend[] = [];
  let invits: Friend[] = [];
  let friendsInterval: ReturnType<typeof setInterval>;

  async function getFriends(): Promise<void> {
    let response = await fetch(API_URL + "/users/friends", {
      credentials: "include",
      mode: "cors",
    });
    friends = await response.json();
  }
  async function getInvits(): Promise<void> {
    let response = await fetch(API_URL + "/users/invits", {
      credentials: "include",
      mode: "cors",
    });
    invits = await response.json();
  }

  onMount(() => {
    getFriends();
    getInvits();
    friendsInterval = setInterval(async () => {
      getFriends();
      getInvits();
    }, 5000);
  });

  onDestroy(() => {
    clearInterval(friendsInterval);
  });
</script>

<div class="overlay">
  <div class="friends" on:click|stopPropagation on:keydown|stopPropagation>
    <div>
      <h2>{$store.username} friends:</h2>
      {#if friends.length > 0}
        <div class="friends-list">
          {#each friends as friend}
            <li>
              <span>{friend.username} is {friend.status}</span>
            </li>
          {/each}
        </div>
      {:else}
        <p>No friends to display</p>
      {/if}
      <h2>{$store.username} invits:</h2>
      {#if invits.length > 0}
        <div class="invits-list">
          {#each invits as invit}
            <li>
              <span>{invit.username} invited you to be friend.</span>
            </li>
          {/each}
        </div>
      {:else}
        <p>No invitations to display</p>
      {/if}
      <div class="friends-controls">
        <h3>Add a friend</h3>
        <form on:submit={addFriend}>
          <input type="text" required/>
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
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

  .friends {
    background-color: #343a40;
    border: 1px solid #198754;
    border-radius: 5px;
    padding: 1rem;
    width: 300px;
    color: #e8e6e3;
    max-height: 80vh;
    overflow: auto;
  }

  h2,
  h3 {
    color: #e8e6e3;
  }

  .friends-list,
  .invits-list {
    overflow-y: scroll;
    max-height: 200px;
  }

  input[type="text"],
  button {
    background-color: #198754;
    border: none;
    color: #e8e6e3;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem;
  }

  input[type="text"]::placeholder {
    color: rgba(232, 230, 227, 0.5);
  }

  input[type="text"]:focus {
    outline: none;
    box-shadow: 0 0 2px 1px rgba(25, 135, 84, 0.5);
  }

  button:hover {
    background-color: #28a745;
  }

  .friends-controls {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  input[type="text"] {
    flex-grow: 1;
    margin-right: 0.25rem;
  }

  button {
    flex-shrink: 0;
  }
</style>
