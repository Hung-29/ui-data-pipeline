import { defineConfig } from "vite";
import { resolve } from "node:path";

const pages = [
  "index.html",
  "datasets.html",
  "dataset-detail.html",
  "challenges.html",
  "challenge-detail.html",
  "knowledge.html",
  "contribute.html",
  "governance.html"
];

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(/\.html$/, ""), resolve(process.cwd(), page)])
      )
    }
  },
  server: { host: "0.0.0.0" },
  preview: { host: "0.0.0.0" }
});
