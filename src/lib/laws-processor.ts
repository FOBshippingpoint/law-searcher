import type { ChLaw, Law } from "../type/index.type";
import { chLaw } from "./ch-law";

const laws = chLawProcessor(chLaw as ChLaw);

function chLawProcessor(chLaw: ChLaw): Law[] {
  const alias = {
    中華民國憲法: "const,憲法,醜逼",
    民法: "civil,民",
  };
  // 各法律
  const laws = chLaw.Laws;
  let rnMax = 0;
  let rnCount;
  let rnMaxA;

  let id = 0;
  for (const l of laws) {
    id += 1;
    // Add alias
    l.LawAlias = alias[l.LawName]
      ? l.LawName.concat("," + alias[l.LawName])
      : l.LawName.concat(",");
    // L.LawUid = nanoid();

    // 第 xx 條 => xx
    const articles = l.LawArticles;

    for (const a of articles) {
      a.ArticleNo = a.ArticleNo.slice(2, -2);
      const regex =
        /\r\n(?![一二三四五六七八九十]{1,3}[、\s]|[┌┐├│]|(?:\s\s){0,1}第\s\d[\d\s]\s|（[一二三四五六七八九十]）|\s\s（[一二三四五六七八九十]）)/;
      a.ArticleContents = a.ArticleContent.split(regex);
      rnCount = (a.ArticleContent.match(new RegExp(regex, "g")) || []).length;
      // Delete a.ArticleContent;
      if (rnCount > rnMax) {
        rnMaxA = a;
        rnMax = rnCount;
      }
    }
  }

  console.log("rnMax:", rnMax);
  console.log("rnMaxA:", rnMaxA);
  return laws;
}

export { laws };
