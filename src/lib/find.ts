import type { Law, LawArticle, Option, Aliases } from "../type/index.type";
import { laws, aliases } from "./laws-processor";

const SCORE = {
  PERFECT: 10,
  CONNECTED: 5,
  COUNT: 1,
};

const SEPARATE_TOKEN = ",";

export async function findLawByAlias(lawName: string) {
  let result: Law = null;

  const regex = new RegExp(
    `^${lawName}${SEPARATE_TOKEN}|${SEPARATE_TOKEN}${lawName}${SEPARATE_TOKEN}|${SEPARATE_TOKEN}${lawName}$`
  );

  Object.entries(aliases).some(([key, value]) => {
    const alias = value.join(SEPARATE_TOKEN).concat(",");
    if (regex.test(alias)) {
      result = laws.find((law) => law.LawName === key);
      return true;
    }
  });

  return result;
}

export async function findLawsByName(lawName: string, limit?: number) {
  const found = laws.filter((law) => {
    let score = 0;
    const alias = aliases[law.LawName].join(SEPARATE_TOKEN).concat(",");
    score += new RegExp(
      `^${lawName}${SEPARATE_TOKEN}|${SEPARATE_TOKEN}${lawName}${SEPARATE_TOKEN}|${SEPARATE_TOKEN}${lawName}$`
    ).test(alias)
      ? SCORE.PERFECT
      : 0;
    if (lawName.length > 1) {
      score += new RegExp(lawName).test(alias) ? SCORE.CONNECTED : 0;
    }

    score +=
      regexCount(alias, `[${lawName}]`) *
      SCORE.COUNT *
      Math.exp(-law.LawName.length);
    law.Score = score;
    if (score === 0) {
      return false;
    }

    return true;
  });

  const sorted = found.sort((a, b) => b.Score - a.Score);

  if (limit) {
    return sorted.slice(0, limit);
  }

  return sorted;
}

export async function findArticlesByOption(
  lawArticles: LawArticle[],
  option: Option
) {
  // find many
  if (Array.isArray(option)) {
    return findArticlesByRange(lawArticles, option[0], option[1]);
  }

  // find one
  if (typeof option === "string") {
    const article = findArticleByNo(lawArticles, option);
    if (article) {
      return [article];
    }
    return [];
  }

  // find all
  return lawArticles;
}

function findArticleByNo(
  lawArticles: LawArticle[],
  no: string
): LawArticle | undefined {
  return lawArticles.find((la) => la.ArticleNo === no);
}

function findIndexByArticleNo(lawArticles: LawArticle[], no: string) {
  return lawArticles.findIndex((la) => la.ArticleNo === no);
}

export function findArticlesByRange(
  lawArticles: LawArticle[],
  start: string,
  end: string
) {
  const length = lawArticles.length;

  const startIdx = findIndexByArticleNo(lawArticles, start);
  const endIdx = findIndexByArticleNo(lawArticles, end);

  let from = startIdx < 0 ? 0 : startIdx;
  let to = endIdx > length - 1 || endIdx === -1 ? length - 1 : endIdx;

  if (from > to) {
    const temporary = from;
    from = to;
    to = temporary;
  }

  return lawArticles.slice(from, to + 1);
}

function regexCount(string_: string, regex: RegExp | string) {
  return (string_.match(new RegExp(regex, "g")) || []).length;
}
