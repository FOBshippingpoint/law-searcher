import { resolve } from "path";
import { bgCyan, black } from "kolorist";

// https://github.com/nodejs/help/issues/2907
import path from "path";
import { fileURLToPath } from "url";

//we need to change up how __dirname is used for ES6 purposes
const dirname = path.dirname(fileURLToPath(import.meta.url));

export const port = parseInt(process.env.PORT || "") || 3303;
export const r = (...args: string[]) => resolve(dirname, "..", ...args);
export const isDev = process.env.NODE_ENV !== "production";

export function log(name: string, message: string) {
  // eslint-disable-next-line no-console
  console.log(black(bgCyan(` ${name} `)), message);
}
