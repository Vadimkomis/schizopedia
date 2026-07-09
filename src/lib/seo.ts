/**
 * Central SEO configuration. SITE_URL is the single value to update when the
 * production domain is finalized — it drives canonical URLs, Open Graph URLs,
 * robots.txt, and the sitemap.
 */
import { getGuide } from "@/lib/guides";
import { getCategoryContent } from "@/lib/categoryContent";

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

const HOME_TITLE =
  "Schizopedia — Plain-Language Guides & Latest Schizophrenia Research";
const HOME_DESCRIPTION =
  "When schizophrenia touches someone you love, start here. Plain-language guides for families and caregivers, plus verifiable, weekly-updated research from PubMed.";

function homeSeo(): SeoMeta {
  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
    type: "website",
    jsonLd: organizationJsonLd(),
  };
}

/** Maps a pathname to its SEO metadata. Used by SeoManager (client) and the
 *  prerenderer (server) so both produce identical tags. */
export function resolveSeo(pathname: string): SeoMeta {
  if (pathname === "/") return homeSeo();

  const guideMatch = pathname.match(/^\/guide\/([^/]+)\/?$/);
  if (guideMatch) {
    const guide = getGuide(guideMatch[1]);
    if (guide) {
      return {
        title: `${guide.title} — Schizophrenia Guide`,
        description: guide.description,
        path: `/guide/${guide.id}`,
        type: "article",
        jsonLd: articleJsonLd({
          headline: guide.title,
          description: guide.description,
          path: `/guide/${guide.id}`,
        }),
      };
    }
  }

  const categoryMatch = pathname.match(/^\/category\/([^/]+)\/?$/);
  if (categoryMatch) {
    const category = getCategoryContent(categoryMatch[1]);
    if (category) {
      const isCure = category.id === "cure";
      return {
        title: isCure
          ? "Schizophrenia Cure Research — Is There a Cure?"
          : `Schizophrenia ${category.title} Research — Latest Studies`,
        description: category.seoDescription,
        path: `/category/${categoryMatch[1]}`,
        type: "website",
        jsonLd: articleJsonLd({
          headline: isCure
            ? "Schizophrenia Cure Research"
            : `Schizophrenia ${category.title} Research`,
          description: category.seoDescription,
          path: `/category/${categoryMatch[1]}`,
        }),
      };
    }
  }

  if (pathname === "/prevalence") {
    return {
      title: "Schizophrenia Prevalence by Country — How Common Is It?",
      description:
        "Schizophrenia affects about 1 in 300 people (~24 million) worldwide. See modelled prevalence estimates by country and why the rate is strikingly consistent across the globe.",
      path: "/prevalence",
      type: "website",
      jsonLd: articleJsonLd({
        headline: "Schizophrenia prevalence around the world",
        description:
          "How common schizophrenia is worldwide and by country, from WHO and IHME Global Burden of Disease estimates.",
        path: "/prevalence",
      }),
    };
  }
  if (pathname === "/donate") {
    return {
      title: "Support Schizopedia — Donate",
      description:
        "Schizopedia is free, ad-free, and collects no personal data. Reader support keeps the plain-language schizophrenia guides and research current.",
      path: "/donate",
      type: "website",
    };
  }
  if (pathname === "/privacy") {
    return {
      title: "Privacy Policy",
      description:
        "Schizopedia collects no personal data, uses no advertising trackers, and requires no account.",
      path: "/privacy",
      type: "website",
    };
  }
  if (pathname === "/terms") {
    return {
      title: "Terms & Conditions",
      description:
        "Schizopedia is for education only — not medical advice. Read our terms of use, including crisis-line guidance.",
      path: "/terms",
      type: "website",
    };
  }

  // Unknown paths redirect to home in the app, so use home metadata.
  return homeSeo();
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Renders the per-route head tags as an HTML string for prerendering. */
export function renderSeoTags(meta: SeoMeta): string {
  const fullTitle = withBrand(meta.title);
  const url = canonicalUrl(meta.path);
  const type = meta.type ?? "website";
  const tags = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  ];
  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
    tags.push(
      `<script type="application/ld+json" id="seo-jsonld">${json}</script>`,
    );
  }
  return tags.join("\n    ");
}
