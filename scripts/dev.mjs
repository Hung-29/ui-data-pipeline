import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), process.argv[2] || ".");
const port = Number(process.env.PORT || 4173);
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".svg":"image/svg+xml" };

http.createServer(async (req, res) => {
  try {
    const raw = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel = raw === "/" ? "index.html" : raw.replace(/^\/+/, "");
    const safe = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
    let file = join(root, safe);
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control":"no-store" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "0.0.0.0", () => console.log(`MiniApp preview: http://0.0.0.0:${port}`));
