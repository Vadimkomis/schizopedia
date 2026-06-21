import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppShell } from "@/AppShell";
import { renderSeoTags, resolveSeo } from "@/lib/seo";
import type { ResearchPayload } from "@/lib/types";

export interface RenderResult {
  html: string;
  head: string;
}

/**
 * Renders a route to static HTML. researchData is injected as a global so
 * useResearchData resolves synchronously during SSR (no fetch waterfall).
 */
export function render(
  url: string,
  researchData: ResearchPayload | null,
): RenderResult {
  globalThis.__RESEARCH__ = researchData ?? undefined;
  const html = renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
  );
  globalThis.__RESEARCH__ = undefined;
  return { html, head: renderSeoTags(resolveSeo(url)) };
}
