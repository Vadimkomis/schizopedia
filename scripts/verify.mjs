/**
 * Pure comparison logic for verifying that articles published in
 * research.json match the live PubMed record they claim to summarize.
 * Network-free so it can be unit tested; the runner lives in
 * verifyResearch.mjs.
 */

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

export function normalizeText(value) {
  if (typeof value !== "string") return "";
  let text = value.replace(/<[^>]+>/g, " ");
  for (const [entity, char] of Object.entries(ENTITIES)) {
    text = text.replaceAll(entity, char);
  }
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function expectedUrl(articleId) {
  return `https://pubmed.ncbi.nlm.nih.gov/${articleId}/`;
}

export function verifyArticle(article, liveRecord) {
  const problems = [];

  if (!liveRecord) {
    problems.push("No live PubMed record found for this PMID.");
    return problems;
  }

  const storedTitle = normalizeText(article.title);
  const liveTitle = normalizeText(liveRecord.title);
  if (!storedTitle || storedTitle !== liveTitle) {
    problems.push(
      `Title mismatch. Stored: "${article.title}" — PubMed: "${liveRecord.title}"`,
    );
  }

  if (article.url !== expectedUrl(article.id)) {
    problems.push(
      `URL "${article.url}" does not point to the canonical PubMed record for PMID ${article.id}.`,
    );
  }

  if (article.journal) {
    const storedJournal = normalizeText(article.journal);
    const liveJournals = [liveRecord.fulljournalname, liveRecord.source]
      .map(normalizeText)
      .filter(Boolean);
    if (liveJournals.length && !liveJournals.includes(storedJournal)) {
      problems.push(
        `Journal mismatch. Stored: "${article.journal}" — PubMed: "${
          liveRecord.fulljournalname ?? liveRecord.source
        }"`,
      );
    }
  }

  return problems;
}

export function verifyPayload(payload, liveById) {
  const issues = [];
  let checked = 0;

  for (const category of payload.categories ?? []) {
    for (const article of category.articles ?? []) {
      checked += 1;
      const problems = verifyArticle(article, liveById[article.id]);
      if (problems.length) {
        issues.push({
          categoryId: category.id,
          articleId: article.id,
          problems,
        });
      }
    }
  }

  return { checked, verified: checked - issues.length, issues };
}
