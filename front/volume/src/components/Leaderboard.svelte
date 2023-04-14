<script lang="ts">
  import type { Player } from "./Profile.svelte";
  import { onMount } from "svelte";
  import { API_URL } from "../Auth";

  let leaderboard: Array<Player> = [];

  async function getLeader(): Promise<void> {
    let response = await fetch(API_URL + "/users/leaderboard", {
      credentials: "include",
      mode: "cors",
    });
    leaderboard = await response.json();
  }

  onMount(() => {
    getLeader();
  });
</script>

<div class="overlay">
  <div class="history" on:click|stopPropagation on:keydown|stopPropagation>
    {#if leaderboard.length > 0}
      <table>
        <thead>
          <tr>
            <th colspan="5">Leaderboard</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rank</td>
            <td>Usernames</td>
            <td>Wins</td>
            <td>Matchs</td>
            <td>Winrates</td>
          </tr>
          {#each leaderboard as player}
            <tr>
              <td>{player.rank}</td>
              <td>{player.username}</td>
              <td>{player.wins}</td>
              <td>{player.matchs}</td>
              <td>{player.winrate.toFixed(2)}%</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No Players to display</p>
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
  .history {
    background-color: #343A40;
    border: 1px solid #198754;
    border-radius: 5px;
    padding: 1rem;
    width: 80%;
    justify-content: center;
    max-height: 500px;
    overflow: auto;
    color: #E8E6E3;
  }

  td {
    border: 1px solid #198754;
    text-align: center;
    max-width: 12ch;
    overflow: hidden;
    padding: 0.25rem 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  table thead th {
    background-color: #198754;
    color: #e8e6e3;
    padding: 0.5rem 0;
  }

  table tbody tr:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>
