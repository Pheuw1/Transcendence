<script lang="ts">
  import { onDestroy, createEventDispatcher } from "svelte";

  export let threshold = 0;
  export let horizontal: boolean = false;
  export let hasMore: boolean = true;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component: HTMLDivElement;

  $: {
    if (component) {
      const element = component.parentNode;

      element.addEventListener("scroll", onScroll);
    }
  }

  const onScroll = (e: Event) => {
    const element = e.target as HTMLDivElement;
    const offset = horizontal
      ? element.scrollWidth - element.clientWidth - element.scrollLeft
      : element.scrollHeight - element.clientHeight - element.scrollTop;
    if (offset <= threshold) {
      if (!isLoadMore && hasMore) dispatch("loadMore");
      isLoadMore = true;
    } else isLoadMore = false;
  };

  onDestroy(() => {
    if (component) {
      const element = component.parentNode;
      element.removeEventListener("scroll", onScroll);
    }
  });
</script>

<div bind:this={component} style="width:0px" />
