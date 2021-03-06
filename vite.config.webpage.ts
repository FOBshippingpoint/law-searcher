import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { r, isDev } from "./scripts/utils";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: r("dist/webpage"),
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
  },
});
