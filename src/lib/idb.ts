import { openDB, DBSchema } from "idb";

async function demo() {
  const db = await openDB("Articles", 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore("articles", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex("date", "date");
    },
  });

  // Add an article:
  await db.add("articles", {
    title: "Article 1",
    date: new Date("2019-01-01"),
    body: "…",
  });

  // Add multiple articles in one transaction:
  {
    const tx = db.transaction("articles", "readwrite");
    await Promise.all([
      tx.store.add({
        title: "Article 2",
        date: new Date("2019-01-01"),
        body: "…",
      }),
      tx.store.add({
        title: "Article 3",
        date: new Date("2019-01-02"),
        body: "…",
      }),
      tx.done,
    ]);
  }

  // Get all the articles in date order:
  console.log(await db.getAllFromIndex("articles", "date"));

  // Add 'And, happy new year!' to all articles on 2019-01-01:
  {
    const tx = db.transaction("articles", "readwrite");
    const index = tx.store.index("date");

    for await (const cursor of index.iterate(new Date("2019-01-01"))) {
      const article = { ...cursor.value };
      article.body += " And, happy new year!";
      cursor.update(article);
    }

    await tx.done;
  }
}

import type { ChLaw, Law } from "../type/index.type";

interface LawDB extends DBSchema {
  laws: {
    key: string;
    value: Law;
  };
  aliases: {
    key: string;
    value: string[];
  };
}

export async function initDB(chLaw: ChLaw) {
  // TODO: check if chLaw has newer version
  const { Laws } = chLaw;

  const db = await openDB<LawDB>("law-db", 1, {
    upgrade(db) {
      db.createObjectStore("laws", { keyPath: "LawName" });
      db.createObjectStore("aliases");
    },
  });

  // laws
  {
    const tx = db.transaction("laws", "readwrite");
    await Promise.all([...Laws.map((law) => tx.store.add(law)), tx.done]);
  }

  // alias
  // {
  //   const tx = db.transaction("aliases", "readwrite");
  //   await Promise.all([
  //     ...Laws.map((law) => tx.store.add([], law.LawName)),
  //     tx.done,
  //   ]);
  // }

  console.log("init");
}

export async function setAlias() {
  const db = await dbConnect();
  db.put("aliases", ["civil", "民"], "民法");
  db.put("aliases", ["const", "憲", "憲法"], "中華民國憲法");
  console.log("setalias");
}

export async function getLawByName(name: string) {
  const db = await dbConnect();
  const law = await db.get("laws", name);

  return law;
}

export async function getAliases() {
  const db = await dbConnect();
  const aliases = await db.getAll("aliases");

  return aliases;
}

export async function putAlias(name, alias) {
  const db = await dbConnect();
  await db.put("aliases", alias, name);
}

async function dbConnect() {
  return await openDB<LawDB>("law-db", 1);
}
