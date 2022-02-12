import fs from "fs-extra";
import { getManifest } from "../src/manifest";
import { r, log, isDev } from "./utils";
import chokidar from "chokidar";

export async function writeManifest() {
  await fs.writeJSON(r("dist/manifest.json"), await getManifest(), {
    spaces: 2,
  });
  log("PRE", "write manifest.json");
}

writeManifest();

if (isDev) {
  // chokidar.watch(r('src/**/*.html'))
  //   .on('change', () => {
  //     stubIndexHtml()
  //   })
  chokidar.watch([r("src/manifest.ts"), r("package.json")]).on("change", () => {
    writeManifest();
  });
}
