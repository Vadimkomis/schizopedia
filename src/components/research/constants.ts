import type { ResearchCategory, ResearchSource } from "@/lib/types";

export const FALLBACK_CATEGORIES: ResearchCategory[] = [
  {
    id: "diagnosis",
    title: "Diagnosis",
    summary:
      "Learn about innovative tools and biomarkers improving early and accurate diagnosis.",
    articles: [],
  },
  {
    id: "treatment",
    title: "Treatment",
    summary:
      "Explore emerging therapies, medications, and approaches improving quality of life.",
    articles: [],
  },
  {
    id: "prevention",
    title: "Prevention",
    summary:
      "Stay informed on research focused on reducing risk factors and promoting brain health.",
    articles: [],
  },
];

export const DEFAULT_SOURCES: ResearchSource[] = [
  {
    name: "PubMed (NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    description: "Peer-reviewed medical literature",
  },
];
