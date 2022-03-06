<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LawResult } from "../type/index.type";
  import "carbon-components-svelte/css/white.css";
  import { Button } from "carbon-components-svelte";
  import Add16 from "carbon-icons-svelte/lib/Add16";
  import Subtract16 from "carbon-icons-svelte/lib/Subtract16";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import Search from "./Search.svelte";
  import LawComponent from "./Law.svelte";
  import { CHUNK_SIZE, WAIT_TIME } from "../config";
  import Settings16 from "carbon-icons-svelte/lib/Settings16";
  import browser from "../lib/browser";

  // ! handle error
  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.log("we got exception, but the app has crashed", e);
    };
  });

  let searchs = [0];
  let searchRefs = [];
  let canFocus = true;
  let idx = 0;
  let lawResults: LawResult[] = [];
  let expanding = true;
  export const isWebpage = false;
  const dispatch = createEventDispatcher();

  hotkeys("s", (e) => {
    if (!canFocus) return;
    searchRefs[idx].focus();
    canFocus = false;
    e.preventDefault();
  });

  // add Search Component
  function handleAdd() {
    searchs.push(0);
    searchs = searchs;
  }

  function handleRemove() {
    searchs.pop();
    searchRefs.pop();
    lawResults.pop();
    searchs = searchs;
    lawResults = lawResults;
  }

  function handleSettings() {
    if (browser) {
      browser.runtime.openOptionsPage();
      return;
    }

    dispatch("openOptions");
    return;
  }

  function wait() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        expanding ? resolve(true) : resolve(false);
      }, WAIT_TIME);
    });
  }
</script>

<main>
  <div>
    {#each searchs as whatever, i}
      <Search
        bind:this={searchRefs[i]}
        on:search={(e) => {
          lawResults[i] = e.detail;
        }}
      />
    {/each}
  </div>
  <div>
    <Button
      size="small"
      iconDescription="Add"
      icon={Add16}
      on:click={handleAdd}
    />
    <Button
      size="small"
      iconDescription="Remove"
      icon={Subtract16}
      on:click={handleRemove}
    />
    {#if !isWebpage}
      <Button
        size="small"
        kind="ghost"
        iconDescription="Settings"
        icon={Settings16}
        on:click={handleSettings}
      />
    {/if}
  </div>
  {#each lawResults as law, i (i)}
    {#each Array(Math.floor(law.articles.length / CHUNK_SIZE) + 1).fill(true) as asdf, j}
      {#await wait() then show}
        {#if show}
          <LawComponent
            name={law.name}
            articles={law.articles.slice(j * CHUNK_SIZE, (j + 1) * CHUNK_SIZE)}
          />
        {/if}
      {/await}
    {/each}
  {/each}
</main>

<style>
  main {
    display: grid;
    padding: 0.5rem;
    row-gap: 0.5rem;
  }
</style>
