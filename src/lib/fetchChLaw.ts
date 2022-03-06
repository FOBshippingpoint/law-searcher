import type { ChLaw } from "../type/index.type";
import JSZip from "jszip";
import browser from "webextension-polyfill";

let dev = false;
let url: string;

if (browser) {
  url = "https://law.moj.gov.tw/api/Ch/Law/JSON";
} else if (dev) {
  url = "/src/assets/ChLaw.json.zip";
} else {
  url = "./assets/ChLaw.json.zip";
}

export async function fetchChLaw(): Promise<ChLaw> {
  // const response = await fetch("https://law.moj.gov.tw/api/Ch/Law/JSON", {
  const response = await fetch("/src/assets/ChLaw.json.zip");
  const blob = await response.blob();

  const zip = await new JSZip().loadAsync(blob);
  const text = await zip.file("ChLaw.json").async("string");
  const chLaw = JSON.parse(text.trim());

  return chLaw;
}
