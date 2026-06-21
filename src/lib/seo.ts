/**
 * Central SEO configuration. SITE_URL is the single value to update when the
 * production domain is finalized — it drives canonical URLs, Open Graph URLs,
 * robots.txt, and the sitemap.
 */
export const SITE_URL = "https://schizopedia.com";
export const SITE_NAME = "Schizopedia";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoMeta {
  title: string;
  description: string;
  /** Path beginning with "/" — combined with SITE_URL for the canonical link. */
  path: string;
  type?: "website" | "article";
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>;
}

export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/$/, "")}`;
}

/** A title with the brand suffix, avoiding duplication when already present. */
export function withBrand(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      "Plain-language guides and verifiable, up-to-date schizophrenia research for families, caregivers, and the curious.",
    about: { "@type": "MedicalCondition", name: "Schizophrenia" },
  };
}

export function articleJsonLd(meta: {
  headline: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: meta.headline,
    description: meta.description,
    url: canonicalUrl(meta.path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
    about: { "@type": "MedicalCondition", name: "Schizophrenia" },
  };
}
