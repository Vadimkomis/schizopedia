/**
 * Generates dist/sitemap.xml from the canonical route list. Run after
 * `vite build` so the sitemap ships in the deployed output.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { buildRoutes } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE_URL = (process.env.SITE_URL ?? "https://schizopedia.org").replace(
  /\/$/,
  "",
);

export function renderSitemap(routes, siteUrl, lastmod) {
  const urls = routes
    .map((route) => {
      const loc = route.path === "/" ? `${siteUrl}/` : `${siteUrl}${route.path}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = renderSitemap(buildRoutes(), SITE_URL, lastmod);
  await fs.mkdir(DIST, { recursive: true });
  await fs.writeFile(path.join(DIST, "sitemap.xml"), xml);
  console.log(
    `Generated sitemap.xml with ${buildRoutes().length} routes (${SITE_URL}) ✅`,
  );
}

// Only run when executed directly, not when imported by tests.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error("Sitemap generation failed:", error.message);
    process.exitCode = 1;
  });
}
