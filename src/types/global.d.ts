import type { ResearchPayload } from "@/lib/types";

declare global {
  interface Window {
    __RESEARCH__?: ResearchPayload | null;
  }
  // Set during prerender (SSR) and read by useResearchData.
  // eslint-disable-next-line no-var
  var __RESEARCH__: ResearchPayload | null | undefined;
}

export {};
