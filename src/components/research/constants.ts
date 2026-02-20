import type { ResearchCategory, ResearchSource } from "@/lib/types";

export const FALLBACK_CATEGORIES: ResearchCategory[] = [
  {
    id: "diagnosis",
    title: "Diagnosis",
    summary:
      "How schizophrenia is identified — from early warning signs to brain imaging and screening tools.",
    articles: [],
  },
  {
    id: "treatment",
    title: "Treatment",
    summary:
      "Current and emerging treatments — including medications, therapy, and newer approaches.",
    articles: [],
  },
  {
    id: "prevention",
    title: "Prevention",
    summary:
      "Research on reducing risk and catching early signs before a full episode develops.",
    articles: [],
  },
];

export const CATEGORY_ACCENTS: Record<
  string,
  { light: string; dark: string }
> = {
  diagnosis: {
    light: "from-[#e9f5ff] via-white to-white",
    dark: "dark:from-[#132037] dark:to-[#0a0f1a]",
  },
  treatment: {
    light: "from-[#fef7ed] via-white to-white",
    dark: "dark:from-[#251926] dark:to-[#0a0f1a]",
  },
  prevention: {
    light: "from-[#eefcf5] via-white to-white",
    dark: "dark:from-[#13261c] dark:to-[#0a0f1a]",
  },
};

export const DEFAULT_ACCENT = {
  light: "from-slate-50 via-white to-white",
  dark: "dark:from-[#111827] dark:to-[#05070d]",
};

export const DEFAULT_SOURCES: ResearchSource[] = [
  {
    name: "PubMed (NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    description: "Peer-reviewed medical literature",
  },
];
