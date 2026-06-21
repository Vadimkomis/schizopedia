import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSeo } from "./useSeo";

function meta(name: string) {
  return document.head
    .querySelector(`meta[name="${name}"]`)
    ?.getAttribute("content");
}
function prop(property: string) {
  return document.head
    .querySelector(`meta[property="${property}"]`)
    ?.getAttribute("content");
}

describe("useSeo", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("sets the document title with the brand suffix", () => {
    renderHook(() =>
      useSeo({ title: "Early warning signs", description: "x", path: "/guide/early-warning-signs" }),
    );
    expect(document.title).toBe("Early warning signs | Schizopedia");
  });

  it("does not double-append the brand when already present", () => {
    renderHook(() =>
      useSeo({ title: "Schizopedia — Home", description: "x", path: "/" }),
    );
    expect(document.title).toBe("Schizopedia — Home");
  });

  it("sets description, canonical, Open Graph, and Twitter tags", () => {
    renderHook(() =>
      useSeo({
        title: "Treatment",
        description: "How treatment works",
        path: "/category/treatment",
        type: "article",
      }),
    );

    expect(meta("description")).toBe("How treatment works");
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://schizopedia.com/category/treatment");
    expect(prop("og:title")).toBe("Treatment | Schizopedia");
    expect(prop("og:type")).toBe("article");
    expect(prop("og:url")).toBe("https://schizopedia.com/category/treatment");
    expect(meta("twitter:card")).toBe("summary_large_image");
  });

  it("builds the root canonical with a trailing slash", () => {
    renderHook(() => useSeo({ title: "Home", description: "x", path: "/" }));
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://schizopedia.com/");
  });

  it("injects JSON-LD when provided and omits it otherwise", () => {
    const { rerender } = renderHook(
      ({ withJson }: { withJson: boolean }) =>
        useSeo({
          title: "T",
          description: "d",
          path: "/guide/x",
          jsonLd: withJson ? { "@type": "MedicalWebPage" } : undefined,
        }),
      { initialProps: { withJson: true } },
    );

    const script = document.getElementById("seo-jsonld");
    expect(script?.textContent).toContain("MedicalWebPage");

    rerender({ withJson: false });
    expect(document.getElementById("seo-jsonld")).toBeNull();
  });

  it("upserts rather than duplicating tags across renders", () => {
    const { rerender } = renderHook(
      ({ d }: { d: string }) => useSeo({ title: "T", description: d, path: "/" }),
      { initialProps: { d: "first" } },
    );
    rerender({ d: "second" });

    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(meta("description")).toBe("second");
  });
});
