/**
 * Classifies a PubMed article into studyType, evidenceLevel, and actionability
 * using the publication types reported by PubMed (esummary `pubtype`) plus
 * keyword heuristics on the title/abstract when PubMed tags are too generic.
 *
 * Evidence levels follow a simplified hierarchy:
 *   synthesis   — meta-analyses, systematic reviews, reviews
 *   clinical    — trials and human observational studies
 *   exploratory — case reports, preclinical/animal/in-vitro, everything else
 */

const PRECLINICAL_PATTERN =
  /\b(mice|mouse|rat|rats|rodent|zebrafish|macaque|in vitro|cell line|animal model|knockout)\b/i;

const OBSERVATIONAL_PATTERN =
  /\b(cohort|case-control|cross-sectional|longitudinal|registry|population-based)\b/i;

const RCT_PATTERN = /\brandomi[sz]ed\b.*\btrial\b|\btrial\b.*\brandomi[sz]ed\b/i;

export function classifyArticle({ title = "", snippet = "", pubTypes = [] }) {
  const types = pubTypes.map((t) => t.toLowerCase());
  const text = `${title} ${snippet}`;
  const has = (needle) => types.some((t) => t.includes(needle));

  if (has("meta-analysis")) {
    return result("Meta-analysis", "synthesis", "discuss_with_clinician");
  }
  if (has("systematic review") || /\bsystematic review\b/i.test(text)) {
    return result("Systematic review", "synthesis", "discuss_with_clinician");
  }
  if (has("review")) {
    return result("Review", "synthesis", "discuss_with_clinician");
  }
  if (has("randomized controlled trial") || RCT_PATTERN.test(text)) {
    return result(
      "Randomized controlled trial",
      "clinical",
      "discuss_with_clinician",
    );
  }
  if (has("clinical trial")) {
    return result("Clinical trial", "clinical", "discuss_with_clinician");
  }
  if (has("case report")) {
    return result("Case report", "exploratory", "emerging_only");
  }
  if (
    has("observational study") ||
    has("multicenter study") ||
    OBSERVATIONAL_PATTERN.test(text)
  ) {
    return result("Observational study", "clinical", "learn");
  }
  if (PRECLINICAL_PATTERN.test(text)) {
    return result("Preclinical study", "exploratory", "emerging_only");
  }
  return result("Peer-reviewed study", "exploratory", "learn");
}

function result(studyType, evidenceLevel, actionability) {
  return { studyType, evidenceLevel, actionability };
}
