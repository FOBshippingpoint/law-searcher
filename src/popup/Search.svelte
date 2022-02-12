<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LawResult, Option } from "../type/index.type";
  import { ComboBox } from "carbon-components-svelte";
  import { laws } from "../lib/laws-processor";
  import { destructArgString } from "../lib/args";
  import {
    findLawsByName,
    findLawByAlias,
    findArticlesByOption,
  } from "../lib/find";

  const dispatch = createEventDispatcher<{ search: LawResult }>();

  let items = [];
  let inputEl: HTMLInputElement;
  let value = "";

  export function focus() {
    inputEl.focus();
  }

  $: arg = destructArgString(value);

  $: getFilteredLaws(arg.lawName).then((newLaws) => {
    items = [
      value,
      ...newLaws.map(({ id, LawName }) => ({ id, text: LawName })),
    ];

    const itemCandidates = newLaws.map(({ id, LawName }) => ({
      id,
      text: LawName,
    }));

    if (itemCandidates.length === 0) {
      items = itemCandidates;
    }
    if (value.length === 0 || value === itemCandidates[0].text) {
      items = itemCandidates;
    } else {
      items = [{ id: "-1", text: value }, ...itemCandidates.slice(0, -1)];
    }
  });

  async function getFilteredLaws(lawName: string) {
    const lawsFound = await findLawsByName(laws, lawName, 5);
    return lawsFound;
  }

  $: {
    getLawResult(arg.lawName, arg.options)
      .then((lawResult) => {
        if (lawResult) dispatch("search", lawResult);
      })
      .catch((error) => console.log(error));
  }

  function handleSearch() {
    getLawResult(arg.lawName, arg.options)
      .then((lawResult) => {
        if (lawResult) dispatch("search", lawResult);
      })
      .catch((error) => console.log(error));
  }

  async function getLawResult(lawName: string, options: Option[]) {
    const lawResult: LawResult = {
      name: "",
      articles: [],
    };
    const lawFound = await findLawByAlias(laws, lawName);

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

<ComboBox size="sm" bind:value bind:ref={inputEl} placeholder="搜尋" {items} />
