import { useEffect, useState } from "react";
import type { ResearchPayload } from "@/lib/types";

const DATA_URL = "/data/research.json";

function embeddedData(): ResearchPayload | null {
  if (typeof window !== "undefined" && window.__RESEARCH__) {
    return window.__RESEARCH__;
  }
  if (typeof globalThis !== "undefined" && globalThis.__RESEARCH__) {
    return globalThis.__RESEARCH__;
  }
  return null;
}

export function useResearchData() {
  const initial = embeddedData();
  const [data, setData] = useState<ResearchPayload | null>(initial);
  const [loading, setLoading] = useState(initial === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prerendered pages ship the data inline — no fetch needed.
    if (embeddedData()) return;

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`Failed to load research feed (${response.status})`);
        }
        const payload = (await response.json()) as ResearchPayload;
        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected research error";
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
