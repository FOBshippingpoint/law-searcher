import type { Law } from "../type/index.type";
import {
  getAliases,
  getLatestUpdateRecord,
  getLaws,
  initDB,
  putAlias,
  putManyAliases,
  putManyLaws,
  putUpdateRecord,
} from "./idb";
import { fetchChLaw } from "./fetchChLaw";

let ready = false;
let laws: Law[];
let aliases: { [key: string]: string[] };
let callbackList: Function[] = [];

// because top-level await is not supported.
(async () => {
  try {
    const dbExists = await initDB();
    if (dbExists) {
      laws = await getLaws();
      aliases = await getAliases();
      console.log(Object.keys(aliases));
      laws.forEach((law) => {
        law.LawAlias = aliases[law.LawName];
      });
    } else {
      // i.e. open initialize db
      console.log("db not found, start initialize...");
      const chLaw = await fetchChLaw();
      const result = preprocess(chLaw.Laws);
      aliases = result.aliases;
      laws = result.laws;
      putUpdateRecord(chLaw.UpdateDate);
      putManyLaws(laws);
      putManyAliases(aliases);
    }

    ready = true;

    callbackList.forEach((callback) => {
      callback();
    });
  } catch (err) {
    console.log(err);
  }
})();

function preprocess(laws: Law[]) {
  const aliases = {};
  laws.forEach((law) => {
    law.LawArticles.forEach((a) => {
      // 第 1 條 => 1
      a.ArticleNo = a.ArticleNo.slice(2, -2);

      // 內文分項
      const regex =
        /\r\n(?![一二三四五六七八九十]{1,3}[、\s]|[┌┐├│]|(?:\s\s){0,1}第\s\d[\d\s]\s|（[一二三四五六七八九十]）|\s\s（[一二三四五六七八九十]）)/;
      a.ArticleContents = a.ArticleContent.split(regex);

      // add alias
      law.LawAlias = [law.LawName];
      aliases[law.LawName] = [law.LawName];
    });
  });

  return { aliases, laws };
}

export function onReady(callback: Function) {
  if (ready) {
    callback();
    return;
  }

  callbackList.push(callback);
}

export async function updateChLaw() {
  if (!ready) {
    throw new Error("Data is not loaded yet.");
  }

  const [chLaw, record] = await Promise.all([
    fetchChLaw(),
    getLatestUpdateRecord(),
  ]);
  if (record && record.date === chLaw.UpdateDate) {
    return { date: record.date, msg: "No need to update" };
  }

  const result = preprocess(chLaw.Laws);
  laws = result.laws;
  laws.forEach(({ LawName }) => {
    // new chLaw has new law
    if (!aliases.hasOwnProperty(LawName)) {
      putAlias(LawName, [LawName]);
    }
  });
  const a = putUpdateRecord(chLaw.UpdateDate);
  const b = putManyLaws(laws);
  const c = putManyAliases(aliases);

  await Promise.all([a, b, c]);
}

export { laws, aliases };
