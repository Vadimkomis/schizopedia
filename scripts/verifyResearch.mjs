/**
 * Verifies that every article published in data/research.json is legitimate:
 * the PMID exists on PubMed and the stored title/journal/URL match the live
 * record. Also confirms the served copy (public/data/research.json) is
 * byte-identical to the source of truth. Exits non-zero on any failure so CI
 * blocks unverifiable content from shipping.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { verifyPayload } from "./verify.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "research.json");
const PUBLIC_DATA_PATH = path.join(ROOT, "public", "data", "research.json");
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const API_KEY = process.env.NCBI_API_KEY?.trim();
const BATCH_SIZE = 100;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchLiveSummaries(ids) {
  const liveById = {};
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const params = new URLSearchParams({
      db: "pubmed",
      retmode: "json",
      id: batch.join(","),
    });
    if (API_KEY) params.set("api_key", API_KEY);
    const response = await fetch(`${PUBMED_BASE}/esummary.fcgi?${params}`, {
      headers: {
        "User-Agent": "schizopedia/1.0 (contact: data-maintainer@example.com)",
      },
    });
    if (!response.ok) {
      throw new Error(`PubMed esummary failed (${response.status})`);
    }
    const json = await response.json();
    for (const id of batch) {
      const record = json?.result?.[id];
      if (record && !record.error) {
        liveById[id] = record;
      }
    }
    if (i + BATCH_SIZE < ids.length) await wait(350);
  }
  return liveById;
}

async function main() {
  const [raw, publicRaw] = await Promise.all([
    fs.readFile(DATA_PATH, "utf8"),
    fs.readFile(PUBLIC_DATA_PATH, "utf8"),
  ]);

  if (raw !== publicRaw) {
    console.error(
      "✗ public/data/research.json is out of sync with data/research.json. Re-run `pnpm fetch`.",
    );
    process.exitCode = 1;
    return;
  }

  const payload = JSON.parse(raw);
  const ids = (payload.categories ?? []).flatMap((category) =>
    (category.articles ?? []).map((article) => article.id),
  );

  if (!ids.length) {
    console.error("✗ No articles found to verify.");
    process.exitCode = 1;
    return;
  }

  const liveById = await fetchLiveSummaries(ids);
  const { checked, verified, issues } = verifyPayload(payload, liveById);

  if (issues.length) {
    console.error(
      `✗ ${issues.length} of ${checked} articles failed verification:`,
    );
    for (const issue of issues) {
      console.error(`  [${issue.categoryId}] PMID ${issue.articleId}`);
      for (const problem of issue.problems) {
        console.error(`    - ${problem}`);
      }
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Verified ${verified}/${checked} articles against live PubMed records ✅`,
  );
}

main().catch((error) => {
  console.error("Verification run failed:", error.message);
  process.exitCode = 1;
});
