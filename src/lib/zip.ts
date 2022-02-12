import JSZip from "jszip";
import { initDB, setAlias } from "./idb";

export async function saveChLaw() {
  // const response = await fetch("https://law.moj.gov.tw/api/Ch/Law/JSON", {
  const response = await fetch("/src/assets/ChLaw.json.zip", {
    method: "GET",
  });
  const blob = await response.blob();

  try {
    const zip = await new JSZip().loadAsync(blob);
    const text = await zip.file("ChLaw.json").async("string");
    const chLaw = JSON.parse(text.trim());
    await initDB(chLaw);
    await setAlias();
    console.log("done");
  } catch (err) {
    console.log(err);
  }
}
