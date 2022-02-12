<script lang="ts">
  import type { LawResult } from "../type/index.type";
  import "carbon-components-svelte/css/white.css";
  import { Button, ListBox } from "carbon-components-svelte";
  import Add16 from "carbon-icons-svelte/lib/Add16";
  import Subtract16 from "carbon-icons-svelte/lib/Subtract16";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import Search from "./Search.svelte";
  import Law from "./Law.svelte";
  import { CHUNK_SIZE, WAIT_TIME } from "../config";

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
    {#each searchs as search, i}
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
  </div>
  {#each lawResults as law, i (i)}
    <!-- 算法可能有BUG -->
    {#each Array(Math.floor(law.articles.length / CHUNK_SIZE) + 1).fill(true) as asdf, j}
      {#await wait() then show}
        {#if show}
          <Law
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
