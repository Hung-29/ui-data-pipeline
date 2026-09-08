import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.name === "dist" || entry.name === "node_modules" || entry.name === ".git" || entry.name === "scripts") continue;
  if (entry.isDirectory() && entry.name !== "assets") continue;
  if (entry.isFile() && !entry.name.endsWith(".html") && entry.name !== "miniapp.json") continue;
  await cp(join(root, entry.name), join(out, entry.name), { recursive: true });
}

console.log(`Built static MiniApp to ${out}`);
