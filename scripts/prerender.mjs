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

async function fontPreloadTags() {
  const assets = await fs.readdir(path.join(DIST, "assets"));
  return assets
    .filter((f) => /^(newsreader|public-sans)-latin-wght-normal-.*\.woff2$/.test(f))
    .map(
      (f) =>
        `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}" />`,
    )
    .join("\n    ");
}

async function main() {
  const [template, dataRaw, { render }, fontPreload] = await Promise.all([
    fs.readFile(path.join(DIST, "index.html"), "utf8"),
    fs.readFile(DATA_PATH, "utf8"),
    import(pathToFileURL(SSR_ENTRY).href),
    fontPreloadTags(),
  ]);

  const data = JSON.parse(dataRaw);
  const serializedData = JSON.stringify(data).replace(/</g, "\\u003c");
  const routes = buildRoutes();

  for (const route of routes) {
    const withData = needsResearchData(route.path);
    const { html, head } = await render(route.path, withData ? data : null);

    const parts = [fontPreload, head];
    if (route.path === "/") {
      // The hero image is the LCP element on the home page — preload it.
      parts.push(
        `<link rel="preload" as="image" href="/hero-brain.webp" type="image/webp" fetchpriority="high" />`,
      );
    }
    if (withData) {
      parts.push(`<script>window.__RESEARCH__=${serializedData}</script>`);
    }

    const page = template
      .replace("<!--app-head-->", parts.filter(Boolean).join("\n    "))
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
