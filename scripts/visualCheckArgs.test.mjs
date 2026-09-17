import { describe, expect, it } from "vitest";
import { resolveVisualCheckBaseUrl } from "./visualCheckArgs.mjs";

describe("resolveVisualCheckBaseUrl", () => {
  it("ignores the package-manager separator before the provided base URL", () => {
    expect(
      resolveVisualCheckBaseUrl(["--", "http://127.0.0.1:5173"]),
    ).toBe("http://127.0.0.1:5173");
  });

  it("accepts a directly provided base URL", () => {
    expect(resolveVisualCheckBaseUrl(["http://127.0.0.1:4173"])).toBe(
      "http://127.0.0.1:4173",
    );
  });

  it.each([{ args: [] }, { args: ["--"] }])(
    "uses the default when no base URL is provided ($args)",
    ({ args }) => {
      expect(resolveVisualCheckBaseUrl(args)).toBe("http://localhost:5173");
    },
  );
});
