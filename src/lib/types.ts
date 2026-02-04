export interface ResearchArticle {
  id: string;
  title: string;
  journal?: string;
  published?: string;
  url: string;
  authors?: string[];
  snippet?: string;
}

export interface ResearchCategory {
  id: string;
  title: string;
  summary: string;
  articles: ResearchArticle[];
}

export interface ResearchSource {
  name: string;
  url: string;
  description?: string;
}

export interface ResearchPayload {
  lastUpdated: string | null;
  categories: ResearchCategory[];
  sources?: ResearchSource[];
}
