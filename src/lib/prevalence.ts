import raw from "../../data/prevalence.json";

export interface CountryPrevalence {
  code: string;
  name: string;
  /** Age-standardized point prevalence, as a percentage of the population. */
  percent: number;
}

export interface GlobalPrevalence {
  affectedMillions: number;
  oneIn: number;
  percent: number;
  source: string;
  sourceUrl: string;
}

export interface EstimatesSource {
  name: string;
  url: string;
  note: string;
}

export interface PrevalenceData {
  lastUpdated: string;
  global: GlobalPrevalence;
  estimatesSource: EstimatesSource;
  countries: CountryPrevalence[];
}

export const prevalence = raw as PrevalenceData;

/** Countries ordered from highest to lowest estimated prevalence. */
export function countriesByPrevalenceDesc(): CountryPrevalence[] {
  return [...prevalence.countries].sort((a, b) => b.percent - a.percent);
}

/** Formats a prevalence percentage for display, e.g. 0.32 → "0.32%". */
export function formatPercent(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

/**
 * Bar width (0–100) for a value, scaled across the country range so the
 * small — but real — differences are visible while the axis stays honest
 * (it starts at zero, not at the minimum).
 */
export function barWidth(percent: number, max: number): number {
  if (max <= 0) return 0;
  return Math.round((percent / max) * 100);
}
