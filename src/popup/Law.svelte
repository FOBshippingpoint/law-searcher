<script lang="ts">
  import type { Law, LawArticle } from "../type/index.type";
  import { TreeView } from "carbon-components-svelte";

  export let name: string = null;
  export let articles: LawArticle[] = [];

  let activeId = "";
  let selectedIds = [];
  let treeView: TreeView;

  $: children = getChildren(articles);

  // maybe TODO: make full tree
  function getChildren(articles: LawArticle[]) {
    return articles.map(({ ArticleType, ArticleNo, ArticleContents }, i) => {
      // 沒有ArticleContents，例如：第一章 總則
      if (ArticleType === "C") {
        return {
          id: i,
          text: ArticleContents[0],
        };
      }

      return {
        id: i,
        text: `第 ${ArticleNo} 條`,
        children: ArticleContents.map((content, ii) => ({
          id: i.toString() + ii,
          text: content,
        })),
      };
    });
  }

  $: {
    articles;
    if (children.length <= 100) treeView?.expandAll();
  }
</script>

{#if name}
  <TreeView
    labelText={name}
    {children}
    bind:activeId
    bind:selectedIds
    bind:this={treeView}
  />
{/if}
