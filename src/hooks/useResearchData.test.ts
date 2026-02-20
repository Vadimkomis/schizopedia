import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useResearchData } from "./useResearchData";
import type { ResearchPayload } from "@/lib/types";

const mockPayload: ResearchPayload = {
  lastUpdated: "2024-08-22T12:00:00.000Z",
  categories: [
    {
      id: "diagnosis",
      title: "Diagnosis",
      summary: "Summary",
      articles: [],
    },
  ],
  sources: [
    {
      name: "PubMed",
      url: "https://pubmed.ncbi.nlm.nih.gov/",
    },
  ],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useResearchData", () => {
  it("starts with loading=true and null data", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useResearchData());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data on successful fetch", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPayload),
    } as Response);

    const { result } = renderHook(() => useResearchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPayload);
    expect(result.current.error).toBeNull();
  });

  it("sets error on HTTP error status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useResearchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(
      "Failed to load research feed (500)",
    );
  });

  it("sets error on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useResearchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("transitions loading from true to false", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPayload),
    } as Response);

    const { result } = renderHook(() => useResearchData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
