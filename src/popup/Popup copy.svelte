<script lang="ts">
  import "carbon-components-svelte/css/white.css";
  import { ComboBox } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { laws } from "../lib/laws-processor";
  import { str2args } from "../lib/args";
  import { findLawsByName } from "../lib/find";
  import hotkeys from "hotkeys-js";

  // ! handle error
  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.log("we got exception, but the app has crashed", e);
    };
  });

  // comboboxitems
  // const items = laws.map(({ id, LawName }) => ({ id, text: LawName }));
  let items = [];
  let inputEl: HTMLInputElement;

  let canFocus = true;

  hotkeys("s", (e) => {
    if (!canFocus) return;

    inputEl.focus();
    canFocus = false;
    e.preventDefault();
  });

  let value = "";

  $: args = str2args(value);

  $: getFilteredLaws(args).then((newLaws) => {
    items = newLaws.map(({ LawName }) => ({ id: LawName, text: LawName }));
  });

  async function getFilteredLaws(args) {
    // search all possible law by args
    const promises = args.map(({ lawName }) =>
      findLawsByName(laws, lawName, 5)
    );

    const lawsFounds = await Promise.all(promises);
    const flatLawsFounds = lawsFounds.flat();

    return flatLawsFounds;
  }

  // function shouldFilterItem(item, value) {
  //   if (!value || value === "") return true;
  //   return filteredLaws.some(({ id }) => item.id === id);
  // }
</script>

<main>
  <ComboBox
    bind:value
    bind:ref={inputEl}
    placeholder="Select contact method"
    {items}
  />
  <ComboBox
    bind:value
    bind:ref={inputEl}
    placeholder="Select contact method"
    {items}
  />
</main>

<style>
  main {
    padding: 1rem;
  }
</style>
