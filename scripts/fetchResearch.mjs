import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "research.json");
const PUBLIC_DATA_PATH = path.join(ROOT, "public", "data", "research.json");
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const RETMAX = Number.parseInt(process.env.RETMAX ?? "5", 10);
const API_KEY = process.env.NCBI_API_KEY?.trim();

const categories = [
  {
    id: "diagnosis",
    title: "Diagnosis",
    summary:
      "How schizophrenia is identified — from early warning signs to brain imaging and screening tools.",
    query:
      "schizophrenia[Title] AND (diagnosis OR early detection OR biomarkers OR screening)",
  },
  {
    id: "treatment",
    title: "Treatment",
    summary:
      "Current and emerging treatments — including medications, therapy, and newer approaches.",
    query:
      "schizophrenia[Title] AND (treatment OR antipsychotic OR psychotherapy OR intervention)",
  },
  {
    id: "prevention",
    title: "Prevention",
    summary:
      "Research on reducing risk and catching early signs before a full episode develops.",
    query:
      "schizophrenia[Title] AND (prevention OR prodromal OR early intervention OR risk reduction)",
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "schizopedia/1.0 (contact: data-maintainer@example.com)",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "schizopedia/1.0 (contact: data-maintainer@example.com)",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return response.text();
}

function buildPubMedUrl(endpoint, params) {
  const searchParams = new URLSearchParams(params);
  if (API_KEY) {
    searchParams.set("api_key", API_KEY);
  }
  return `${PUBMED_BASE}/${endpoint}?${searchParams.toString()}`;
}

async function fetchAbstracts(ids) {
  if (!ids.length) return {};

  const url = buildPubMedUrl("efetch.fcgi", {
    db: "pubmed",
    rettype: "abstract",
    retmode: "xml",
    id: ids.join(","),
  });

  const xml = await fetchText(url);
  const abstracts = {};

  // Parse <AbstractText> blocks from XML.
  // Each article is in a <PubmedArticle> containing <PMID> and <AbstractText>.
  const articleBlocks = xml.split("<PubmedArticle>");
  for (const block of articleBlocks) {
    const pmidMatch = block.match(/<PMID[^>]*>(\d+)<\/PMID>/);
    if (!pmidMatch) continue;

    const pmid = pmidMatch[1];

    // Collect all <AbstractText> sections (some abstracts have labeled sections)
    const abstractParts = [];
    const abstractRegex = /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g;
    let match;
    while ((match = abstractRegex.exec(block)) !== null) {
      abstractParts.push(match[1].replace(/<[^>]+>/g, "").trim());
    }

    if (abstractParts.length > 0) {
      const fullAbstract = abstractParts.join(" ");
      abstracts[pmid] =
        fullAbstract.length > 250
          ? `${fullAbstract.slice(0, 247)}...`
          : fullAbstract;
    }
  }

  return abstracts;
}

async function fetchPubMedArticles(query) {
  const searchUrl = buildPubMedUrl("esearch.fcgi", {
    db: "pubmed",
    retmode: "json",
    sort: "pub+date",
    retmax: String(RETMAX),
    term: query,
  });

  const searchJson = await fetchJson(searchUrl);
  const ids = searchJson?.esearchresult?.idlist ?? [];
  if (!ids.length) {
    return [];
  }

  // Respect NCBI rate limits between API families.
  await wait(350);

  const summaryUrl = buildPubMedUrl("esummary.fcgi", {
    db: "pubmed",
    retmode: "json",
    id: ids.join(","),
  });

  const summaryJson = await fetchJson(summaryUrl);
  const result = summaryJson?.result ?? {};

  // Fetch real abstracts via efetch
  await wait(350);
  const abstracts = await fetchAbstracts(ids);

  return ids
    .map((id) => result[id])
    .filter(Boolean)
    .map((article) => ({
      id: article.uid,
      title: article.title,
      journal: article.fulljournalname ?? article.source ?? "Unknown journal",
      published: article.pubdate,
      url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
      authors: (article.authors ?? []).map((author) => author.name).slice(0, 5),
      snippet:
        abstracts[article.uid] ?? "View full article on PubMed",
    }));
}

async function buildPayload() {
  const payload = {
    lastUpdated: new Date().toISOString(),
    categories: [],
    sources: [
      {
        name: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        description:
          "The National Institutes of Health's free database of medical research.",
      },
    ],
  };

  for (const category of categories) {
    const articles = await fetchPubMedArticles(category.query);
    payload.categories.push({
      id: category.id,
      title: category.title,
      summary: category.summary,
      articles,
    });
  }

  return payload;
}

async function writePayload(payload) {
  const body = JSON.stringify(payload, null, 2);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.mkdir(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
  await Promise.all([
    fs.writeFile(DATA_PATH, body),
    fs.writeFile(PUBLIC_DATA_PATH, body),
  ]);
}

async function main() {
  try {
    const payload = await buildPayload();
    await writePayload(payload);
    const total = payload.categories.reduce(
      (acc, category) => acc + category.articles.length,
      0,
    );
    console.log(
      `Saved ${total} articles to ${path.relative(ROOT, DATA_PATH)} and ${path.relative(
        ROOT,
        PUBLIC_DATA_PATH,
      )}`,
    );
    for (const cat of payload.categories) {
      console.log(`  ${cat.title}: ${cat.articles.length} articles`);
    }
  } catch (error) {
    console.error("Failed to refresh research feed");
    console.error(error);
    process.exitCode = 1;
  }
}

main();
