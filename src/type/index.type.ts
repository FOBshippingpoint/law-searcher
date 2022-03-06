export type DayPeriod = "morning" | "afternoon" | "night";

export type LawArticle = {
  ArticleType: string;
  ArticleNo: string;
  ArticleContent: string;
  ArticleContents?: string[];
  ArticleUid?: string;
};

export type Law = {
  Score?: number;
  LawAlias?: string[];
  LawLevel: string;
  LawName: string;
  LawURL: string;
  LawCategory: string;
  LawModifiedDate: string;
  LawEffectiveDate: string;
  LawEffectiveNote: string;
  LawAbandonNote: string;
  LawHasEngVersion: string;
  EngLawName: string;
  LawAttachements: Array<{
    FileName: string;
    FileURL: string;
  }>;
  LawHistories: string;
  LawForeword: string;
  LawArticles: LawArticle[];
};

export type ChLaw = {
  UpdateDate: string;
  Laws: Law[];
};

export type Option = string | string[] | null;

export type Arg = {
  lawName: string;
  options: Option[];
};

export type LawResult = {
  name: string;
  articles: LawArticle[];
} | null;

export type LawNameMap = Map<string, string>;

export type Aliases = {
  [key: string]: string[];
};
