// Date helpers for PubMed / ISO publication strings. Everything is parsed and
// formatted in UTC so server-prerendered HTML matches the client render and
// there are no hydration mismatches.

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** Parses ISO ("2026-06-12") or PubMed ("2026 Jun 12", "2026 May") dates. */
export function parseDateUtc(value: string): Date | null {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, y, m, d] = isoDate;
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  }
  const pubmed = value.match(/^(\d{4})\s+([A-Za-z]{3})[a-z]*(?:\s+(\d{1,2}))?/);
  if (pubmed) {
    const [, y, mon, d] = pubmed;
    const month = MONTHS.indexOf(mon.toLowerCase());
    if (month >= 0) {
      return new Date(Date.UTC(Number(y), month, d ? Number(d) : 1));
    }
  }
  return null;
}

/** Sortable timestamp; falls back to a bare year, then 0 when unparseable. */
export function publishedTimestamp(value: string | undefined): number {
  if (!value) return 0;
  const parsed = parseDateUtc(value);
  if (parsed) return parsed.getTime();
  const yearMatch = value.match(/\b(19|20|21)\d{2}\b/);
  if (yearMatch) return Date.UTC(Number(yearMatch[0]), 0, 1);
  return 0;
}

/** Short, human label like "Jun 12, 2026"; falls back to a bare year. */
export function formatPublishedShort(value: string | undefined): string | null {
  if (!value) return null;
  const parsed = parseDateUtc(value);
  if (parsed) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(parsed);
  }
  const yearMatch = value.match(/\b(19|20|21)\d{2}\b/);
  return yearMatch ? yearMatch[0] : value;
}
