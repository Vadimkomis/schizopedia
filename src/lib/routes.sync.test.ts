import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs module shared with build scripts
import { GUIDE_IDS, CATEGORY_IDS } from "../../scripts/routes.mjs";
import { GUIDES } from "./guides";
import { FALLBACK_CATEGORIES } from "@/components/research/constants";

describe("sitemap route lists stay in sync with the app", () => {
  it("lists exactly the guide ids the app renders", () => {
    expect([...GUIDE_IDS].sort()).toEqual(GUIDES.map((g) => g.id).sort());
  });

  it("lists exactly the category ids the app renders", () => {
    expect([...CATEGORY_IDS].sort()).toEqual(
      FALLBACK_CATEGORIES.map((c) => c.id).sort(),
    );
  });
});
