/**
 * Canonical list of crawlable routes, shared by the sitemap generator.
 * Guide and category ids are mirrored from src/lib/guides.ts and
 * src/components/research/constants.ts; a unit test asserts they stay in sync.
 */
export const GUIDE_IDS = [
  "what-is-schizophrenia",
  "early-warning-signs",
  "getting-help",
  "treatment-explained",
  "caring-for-yourself",
];

export const CATEGORY_IDS = ["diagnosis", "treatment", "prevention", "cure"];

export function buildRoutes() {
  return [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    ...GUIDE_IDS.map((id) => ({
      path: `/guide/${id}`,
      priority: "0.9",
      changefreq: "monthly",
    })),
    ...CATEGORY_IDS.map((id) => ({
      path: `/category/${id}`,
      priority: "0.7",
      changefreq: "weekly",
    })),
    { path: "/donate", priority: "0.4", changefreq: "monthly" },
    { path: "/privacy", priority: "0.2", changefreq: "yearly" },
    { path: "/terms", priority: "0.2", changefreq: "yearly" },
  ];
}
