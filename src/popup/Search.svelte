<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LawResult, Option } from "../type/index.type";
  import { ComboBox } from "carbon-components-svelte";
  import { destructArgString } from "../lib/args";
  import {
    findLawsByName,
    findLawByAlias,
    findArticlesByOption,
  } from "../lib/find";
  import { aliases, onReady } from "../lib/laws-processor";

  let ready = false;
  onReady(() => {
    ready = true;
  });

  const dispatch = createEventDispatcher<{ search: LawResult }>();

  let items = [];
  let inputEl: HTMLInputElement;
  let value = "";

  export function focus() {
    inputEl.focus();
  }

  $: arg = destructArgString(value);

  $: getFilteredLaws(arg.lawName).then((newLaws) => {
    if (!ready) return;

    if (newLaws.length === 0) {
      items = [];
      return;
    }

    const candidates = newLaws.map(({ LawName }) => ({
      id: LawName,
      text: LawName,
    }));

    // 如果value=法規名稱或別名
    if (
      arg.lawName === candidates[0].text ||
      aliases[candidates[0].text]?.includes(arg.lawName)
    ) {
      candidates[0].text = candidates[0].text.concat(
        value.replace(arg.lawName, "")
      );
      items = [candidates[0]];
      return;
    }

    if (value === "") {
      items = candidates;
      return;
    }

    items = [{ id: -1, text: value }, ...candidates.slice(1)];
  });

  async function getFilteredLaws(lawName: string) {
    if (!ready) return;

    const lawsFound = await findLawsByName(lawName, 5);
    return lawsFound;
  }

  $: {
    getLawResult(arg.lawName, arg.options)
      .then((lawResult) => {
        if (lawResult) dispatch("search", lawResult);
      })
      .catch((error) => console.log(error));
  }

  async function getLawResult(lawName: string, options: Option[]) {
    if (!ready) return;

    const lawResult: LawResult = {
      name: "",
      articles: [],
    };
    const lawFound = await findLawByAlias(lawName);

    if (!lawFound) return;
    lawResult.name = lawFound.LawName;

    const articlesPromises = options.map(async (option) => {
      const articles = await findArticlesByOption(lawFound.LawArticles, option);
      return articles;
    });

    for (const articlesPromise of articlesPromises) {
      const articles = await articlesPromise;
      lawResult.articles.push(...articles);
    }

    return lawResult;
  }
</script>

<ComboBox
  disabled={!ready}
  size="sm"
  bind:value
  bind:ref={inputEl}
  placeholder={ready ? "搜尋" : "載入中..."}
  {items}
/>
