<script lang="ts">
  import type { Aliases, LawResult, Law } from "../type/index.type";
  import "carbon-components-svelte/css/white.css";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import { Search } from "carbon-components-svelte";
  import { TextInputSkeleton } from "carbon-components-svelte";

  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
  import { TextInput } from "carbon-components-svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { InlineNotification } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import { separateString } from "../lib/args";
  import { CHUNK_SIZE, WAIT_TIME } from "../config";
  import FaceDissatisfied32 from "carbon-icons-svelte/lib/FaceDissatisfied32";
  import Search16 from "carbon-icons-svelte/lib/Search16";
  import {
    findLawsByName,
    findLawByAlias,
    findArticlesByOption,
  } from "../lib/find";
  import {
    getAliases,
    getLatestUpdateRecord,
    putManyAliases,
  } from "../lib/idb";
  import { onReady, updateChLaw } from "../lib/laws-processor";
  import CloudDownload16 from "carbon-icons-svelte/lib/CloudDownload16";
  import browser from "../lib/browser";

  let ready = false;
  onReady(() => {
    ready = true;

    getAliases().then((aliases) => {
      const newItems = [];
      for (const prop in aliases) {
        let alias = "";
        if (aliases[prop].length > 1) {
          alias = aliases[prop].slice(1).join(",").concat(",");
        }

        newItems.push({
          name: prop,
          alias,
        });
      }

      items = newItems;
      previousAliases = aliases;
    });

    getLatestUpdateRecord().then((record) => {
      if (record) {
        const timestamp = new Date(record.timestamp).toLocaleString();
        updateInfo = `最後一次更新時間：${timestamp}（${record.date}版）`;
      }
    });
  });

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
  let inputEls: { [key: string]: HTMLInputElement } = {};
  let saveDisabled: boolean = false;
  let updateDisabled: boolean = false;
  let previousAliases: { [key: string]: string[] };
  let updateInfo = "";
  export let isWebpage = false;

  $: getFilteredLaws(value).then((lawsFound) => {
    if (!ready) return;

    items = lawsFound.map(({ LawName }) => {
      let alias = "";
      if (previousAliases && previousAliases[LawName].length > 1) {
        alias = previousAliases[LawName].slice(1).join(",").concat(",");
      }

      return {
        name: LawName,
        alias,
      };
    });
  });

  async function getFilteredLaws(name: string) {
    if (!ready) return;

    const lawsFound = await findLawsByName(name);
    return lawsFound;
  }

  async function handleSave() {
    saveDisabled = true;

    const aliases: Aliases = {};

    // filter object to get only value is not null
    Object.keys(inputEls).forEach((key) => {
      if (inputEls[key]) {
        const value = inputEls[key].value;
        const newAlias = [key, ...value.split(",").filter((v) => v.length > 0)];
        if (newAlias !== previousAliases[key]) {
          aliases[key] = newAlias;
        }
      }
    });

    try {
      await putManyAliases(aliases);
      previousAliases = aliases;
      console.log("saved");
    } catch (err) {
      console.log(err);
    } finally {
      saveDisabled = false;
    }
  }

  async function handleUpdate() {
    updateDisabled = true;

    try {
      const { date, msg } = await updateChLaw();
      if (msg === "No need to update") {
        updateInfo = `法規已是最新版本（${date}版）`;
      } else {
        updateInfo = `法規更新成功（${date}版）`;
      }
    } catch (err) {
      updateInfo = "法規更新失敗:(";
      console.log(err);
    } finally {
      updateDisabled = false;
    }
  }

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
  <Tabs autoWidth>
    <Tab label="法規別名" />
    <Tab label="法規更新" />
    <Tab label="其他" />
    <svelte:fragment slot="content">
      <TabContent>
        <content>
          <Search
            disabled={!ready}
            placeholder={ready ? "搜尋法規名稱或別名" : "載入中..."}
            bind:value
            autofocus
          />
          <Button
            size="small"
            icon={Save16}
            on:click={handleSave}
            disabled={saveDisabled}>儲存</Button
          >
          <StructuredList condensed>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>法規</StructuredListCell>
                <StructuredListCell head>別名</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {#if items.length === 0}
                <div class="not-found">沒有關於"{value}"的法規</div>
              {:else}
                {#each Array(Math.floor(items.length / CHUNK_SIZE) + 1).fill(true) as whatever, i}
                  {#await wait(i) then show}
                    {#each items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE) as { name, alias } (name)}
                      <StructuredListRow label for="row-{name}">
                        <StructuredListCell>{name}</StructuredListCell>
                        <StructuredListCell>
                          <TextInput
                            placeholder="請以<,>進行分隔"
                            value={alias}
                            bind:ref={inputEls[name]}
                          />
                        </StructuredListCell>
                      </StructuredListRow>
                    {/each}
                  {/await}
                {/each}
              {/if}
            </StructuredListBody>
          </StructuredList>
        </content>
      </TabContent>
      <TabContent>
        <content>
          <Button
            icon={CloudDownload16}
            on:click={handleUpdate}
            disabled={updateDisabled}
            >{updateDisabled ? "下載中..." : "更新法規"}</Button
          >
          <p>{updateInfo}</p>
        </content>
      </TabContent>
      <TabContent>Content 3</TabContent>
    </svelte:fragment>
  </Tabs>
</main>

<style>
  main {
    padding: 0.5rem;
  }

  content {
    display: grid;
    row-gap: 0.5rem;
  }

  .not-found {
    margin-top: 1rem;
  }
</style>
