/**
 * Prerenders every route to static HTML using the Vite SSR bundle. Runs in
 * pure Node (no browser), so it works in any CI including Cloudflare's build.
 *
 * Pipeline: `vite build` (client) → `vite build --ssr` (server bundle) →
 * this script → dist/<route>/index.html with head, body, and (for data
 * routes) the research payload inlined so there's no client fetch.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { buildRoutes } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");
const DATA_PATH = path.join(ROOT, "data", "research.json");

function needsResearchData(routePath) {
  return routePath === "/" || routePath.startsWith("/category/");
}

// Flat <route>.html files (not <route>/index.html) so Cloudflare serves the
// clean, no-trailing-slash URL directly (matching our canonical URLs) with no
// redirect hop.
function outputFile(routePath) {
  if (routePath === "/") return path.join(DIST, "index.html");
  return path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
}

async function main() {
  const [template, dataRaw, { render }] = await Promise.all([
    fs.readFile(path.join(DIST, "index.html"), "utf8"),
    fs.readFile(DATA_PATH, "utf8"),
    import(pathToFileURL(SSR_ENTRY).href),
  ]);

  const data = JSON.parse(dataRaw);
  const serializedData = JSON.stringify(data).replace(/</g, "\\u003c");
  const routes = buildRoutes();

  for (const route of routes) {
    const withData = needsResearchData(route.path);
    const { html, head } = render(route.path, withData ? data : null);

    const headInjection = withData
      ? `${head}\n    <script>window.__RESEARCH__=${serializedData}</script>`
      : head;

    const page = template
      .replace("<!--app-head-->", headInjection)
      .replace("<!--app-html-->", html);

    const file = outputFile(route.path);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, page);
  }

  console.log(`Prerendered ${routes.length} routes to static HTML ✅`);
}

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exitCode = 1;
});
