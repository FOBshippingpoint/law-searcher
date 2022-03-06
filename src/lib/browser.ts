import type { Browser } from "webextension-polyfill";

let browser: Browser;

import("webextension-polyfill")
  .then((module) => {
    browser = module;
  })
  .catch((err) => {
    console.log(err);
  });

export default browser;
