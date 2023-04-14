<script lang="ts">
    import { onMount } from "svelte";
    import { element } from "svelte/internal";
  export let message;
  export let form = true;
  export let hidden = false;
  export let onCancel = () => {};
  export let onOkay = () => {};
  import { content, popup } from "./content";


  let value = '';
  let onChange = () => {
    $content = "";
    popup.set(null);
  }; q

  function _onCancel() {
    onCancel();
    $content = "";
    popup.set(null);
  }

  function _onOkay() {
    onOkay();
    if (form)
      $content = value;
    else
      $content = "ok"
    popup.set(null);
  }

  $: onChange();

</script>
  <h2>{message}</h2>
  {#if form === true}
    {#if hidden === true}
    <input required type='password' bind:value on:keydown={(e) => e.which === 13 && _onOkay()} />
    {:else}
    <input required type='text' bind:value on:keydown={(e) => e.which === 13 && _onOkay()} />
    {/if}
  {/if}

  <div class="buttons">
    <button on:click={_onCancel}> Cancel </button>
    <button on:click={_onOkay}> Okay </button>
  </div>
<style>
  h2 {
    font-size: 1rem;
    text-align: center;
  }

  input {
    width: 100%;
    text-align: center;
    word-wrap:break-word;

  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
