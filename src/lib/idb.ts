import { openDB, DBSchema } from "idb";
import type { Aliases, ChLaw, Law } from "../type/index.type";

interface LawDB extends DBSchema {
  "update-records": {
    // date time stamp
    key: number;
    // ChLaw.UpdateDate: string
    value: string;
  };
  laws: {
    key: string;
    value: Law;
  };
  aliases: {
    key: string;
    value: string[];
  };
}

export async function initDB() {
  let exists = true;
  await openDB<LawDB>("law-db", 1, {
    upgrade(db) {
      console.log("upgrade");
      db.createObjectStore("update-records");
      db.createObjectStore("laws", { keyPath: "LawName" });
      db.createObjectStore("aliases");
      exists = false;
    },
  });
  return exists;
}

export async function getLatestUpdateRecord(): Promise<{
  timestamp: number;
  date: string;
}> {
  const db = await dbConnect();
  const cursor = await db
    .transaction("update-records")
    .store.openCursor(null, "prev");
  if (cursor) {
    return {
      timestamp: cursor.key,
      date: cursor.value,
    };
  }
}

export async function putUpdateRecord(chLawUpdateDate: string) {
  const db = await dbConnect();
  db.put("update-records", chLawUpdateDate, Date.now());
}

export async function putManyLaws(laws: Law[]) {
  const db = await dbConnect();
  const tx = db.transaction("laws", "readwrite");
  await Promise.all([...laws.map((law) => tx.store.put(law)), tx.done]);
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

export async function getLaws() {
  const db = await dbConnect();
  const laws = await db.getAll("laws");

  return laws;
}

export async function getAliases() {
  const db = await dbConnect();
  const keys = await db.getAllKeys("aliases");
  const tx = db.transaction("aliases", "readonly");
  const aliases: Aliases = {};
  const promises = keys.map(async (key) => {
    aliases[key] = await tx.store.get(key);
  });
  await Promise.all([...promises, tx.done]);

  return aliases;
}

export async function putAlias(name: string, alias: string[]) {
  const db = await dbConnect();
  await db.put("aliases", alias, name);
}

export async function putManyAliases(aliases: { [key: string]: string[] }) {
  const db = await dbConnect();
  const tx = db.transaction("aliases", "readwrite");
  await Promise.all([
    ...Object.entries(aliases).map(([name, alias]) =>
      tx.store.put(alias, name)
    ),
    tx.done,
  ]);
}

async function dbConnect() {
  return await openDB<LawDB>("law-db");
}
