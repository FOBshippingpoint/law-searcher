# idb

## schema

- Law
  - key: LawName
  - value:
    LawAlias?: string;
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
  - indexes
