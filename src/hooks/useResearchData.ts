import { useEffect, useState } from "react";
import type { ResearchPayload } from "@/lib/types";

const DATA_URL = "/data/research.json";

export function useResearchData() {
  const [data, setData] = useState<ResearchPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`${DATA_URL}?t=${Date.now()}`, {
          cache: "no-store",
        });
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
