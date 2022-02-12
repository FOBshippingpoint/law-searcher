<script lang="ts">
  import type { LawResult, Law } from "../type/index.type";
  import "carbon-components-svelte/css/white.css";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import { Search } from "carbon-components-svelte";

  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { laws } from "../lib/laws-processor";
  import { Button } from "carbon-components-svelte";
  import { TextInput } from "carbon-components-svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { InlineNotification } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import { separateString } from "../lib/args";
  import { CHUNK_SIZE, WAIT_TIME } from "../config";

  import {
    findLawsByName,
    findLawByAlias,
    findArticlesByOption,
  } from "../lib/find";
  import { saveChLaw } from "../lib/zip";

  // ! handle error
  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.log("we got exception, but the app has crashed", e);
    };
  });

  type LawItem = {
    name: string;
    alias: string;
  };

  let value = "";
  let items: LawItem[] = [];
  let changed: { [key: string]: string } = {};

  $: getFilteredLaws(value).then((lawsFound) => {
    items = lawsFound.map(({ LawName, LawAlias }) => {
      return {
        name: LawName,
        alias: separateString(LawAlias, /,/)[1].slice(1),
      };
    });
  });

  async function getFilteredLaws(name: string) {
    const lawsFound = await findLawsByName(laws, name);
    console.log(lawsFound);
    return lawsFound;
  }

  function handleChange({ name, alias }) {
    // add change
    changed[name] = alias;
  }

  function handleSave() {}

  function wait(idx: number) {
    // if is first then don't wait
    if (idx === 0) {
      return new Promise<boolean>((resolve) => {
        resolve(true);
      });
    }

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, WAIT_TIME);
    });
  }
</script>

<main>
  <!-- <Tabs autoWidth>
    <Tab label="Tab label 1" />
    <Tab label="Tab label 2" />
    <Tab label="Tab label 3" />
    <svelte:fragment slot="content">
      <TabContent>Content 1</TabContent>
      <TabContent>Content 2</TabContent>
      <TabContent>Content 3</TabContent>
    </svelte:fragment>
  </Tabs> -->
  <Button size="small" icon={Save16} on:click={saveChLaw}>zip</Button>
  <Search placeholder="搜尋法規名稱或別名" bind:value />
  <Button size="small" icon={Save16} on:click={handleSave}>儲存</Button>
  <StructuredList condensed>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>法規</StructuredListCell>
        <StructuredListCell head>別名</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each Array(Math.floor(items.length / CHUNK_SIZE) + 1).fill(true) as whatever, i}
        {#await wait(i) then show}
          {#each items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE) as { name, alias }}
            <StructuredListRow label for="row-{name}">
              <StructuredListCell>{name}</StructuredListCell>
              <StructuredListCell>
                <TextInput
                  bind:value={alias}
                  placeholder="請以<,>進行分隔"
                  on:input={() => {
                    handleChange({ name, alias });
                  }}
                />
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        {/await}
      {/each}
    </StructuredListBody>
  </StructuredList>
  <div class="notification">
    <InlineNotification
      kind="success"
      title="Success:"
      subtitle="Your settings have been saved."
    />
  </div>
</main>

<style>
  main {
    display: grid;
    padding: 0.5rem;
    row-gap: 0.5rem;
  }

  .notification {
    position: fixed;
    bottom: 0;
    left: 1rem;
  }
</style>
