<script lang="ts">
  import Popup from "./popup/Popup.svelte";
  import Options from "./options/Options.svelte";
  import Search16 from "carbon-icons-svelte/lib/Search16";
  import Settings16 from "carbon-icons-svelte/lib/Settings16";
  import { Button } from "carbon-components-svelte";
  import { Breakpoint } from "carbon-components-svelte";

  let size;
  let events = [];
  let page = "popup";
</script>

<Breakpoint bind:size on:match={(e) => (events = [...events, e.detail])} />

<main>
  <Button
    size="small"
    kind="secondary"
    icon={page === "popup" ? Settings16 : Search16}
    on:click={() => {
      page = page === "popup" ? "options" : "popup";
    }}>{page === "popup" ? "設定頁面" : "搜尋頁面"}</Button
  >
  <section class={size}>
    {#if page === "popup"}
      <Popup isWebpage />
    {:else}
      <Options />
    {/if}
  </section>
</main>

<style>
  .max {
    margin: 0 20%;
  }
  .xlg {
    margin: 0 20%;
  }
  .lg {
    margin: 0 10%;
  }
</style>
