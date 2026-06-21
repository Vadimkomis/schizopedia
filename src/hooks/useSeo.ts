import { useEffect } from "react";
import {
  canonicalUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  withBrand,
  type SeoMeta,
} from "@/lib/seo";

const JSON_LD_ID = "seo-jsonld";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown> | undefined) {
  const existing = document.getElementById(JSON_LD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = JSON_LD_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets per-route document head: title, description, canonical, Open Graph,
 * Twitter card, and optional JSON-LD. Runs client-side; when the page is
 * prerendered the resulting tags are captured into the static HTML.
 */
export function useSeo(meta: SeoMeta): void {
  const { title, description, path, type = "website", jsonLd } = meta;

  useEffect(() => {
    const fullTitle = withBrand(title);
    const url = canonicalUrl(path);

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertCanonical(url);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:image", DEFAULT_OG_IMAGE);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", DEFAULT_OG_IMAGE);

    upsertJsonLd(jsonLd);
  }, [title, description, path, type, jsonLd]);
}
