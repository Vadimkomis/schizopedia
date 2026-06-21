import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppShell } from "@/AppShell";
import { renderSeoTags, resolveSeo } from "@/lib/seo";
import type { ResearchPayload } from "@/lib/types";

export interface RenderResult {
  html: string;
  head: string;
}

/**
 * Renders a route to static HTML. Uses renderToPipeableStream with onAllReady
 * so lazy (code-split) route components fully resolve before the HTML is
 * captured. researchData is injected as a global so useResearchData resolves
 * synchronously during SSR (no fetch waterfall).
 */
export function render(
  url: string,
  researchData: ResearchPayload | null,
): Promise<RenderResult> {
  globalThis.__RESEARCH__ = researchData ?? undefined;

  return new Promise((resolve, reject) => {
    let body = "";
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>,
      {
        onAllReady() {
          const sink = new Writable({
            write(chunk, _enc, cb) {
              body += chunk;
              cb();
            },
            final(cb) {
              cb();
            },
          });
          sink.on("finish", () => {
            globalThis.__RESEARCH__ = undefined;
            resolve({ html: body, head: renderSeoTags(resolveSeo(url)) });
          });
          pipe(sink);
        },
        onError(error) {
          globalThis.__RESEARCH__ = undefined;
          reject(error);
        },
      },
    );
  });
}
