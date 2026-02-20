import { formatDateTime } from "@/lib/format";
import type { ResearchPayload } from "@/lib/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  FALLBACK_CATEGORIES,
  CATEGORY_ACCENTS,
  DEFAULT_ACCENT,
  DEFAULT_SOURCES,
} from "./constants";
import { HeroPanel } from "./HeroPanel";
import { CategoryCard } from "./CategoryCard";
import { SourcesPanel } from "./SourcesPanel";

export interface ResearchDashboardProps {
  data: ResearchPayload | null;
  loading: boolean;
  error: string | null;
}

export function ResearchDashboard({
  data,
  loading,
  error,
}: ResearchDashboardProps) {
  const categories = data?.categories?.length
    ? data.categories
    : FALLBACK_CATEGORIES;
  const sources = data?.sources?.length ? data.sources : DEFAULT_SOURCES;
  const totalArticles = data?.categories?.reduce(
    (sum, category) => sum + (category.articles?.length ?? 0),
    0,
  );

  return (
    <div className="relative overflow-hidden text-slate-900 dark:text-white">
      <div className="grid-overlay" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-transparent to-transparent dark:from-transparent" />
      <div className="container relative z-10 space-y-10 py-10 lg:py-16">
        <a
          href="#research-categories"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg dark:focus:bg-slate-800"
        >
          Skip to research categories
        </a>

        <Tabs defaultValue={categories[0]?.id ?? "diagnosis"}>
          <HeroPanel
            lastUpdated={formatDateTime(data?.lastUpdated)}
            totalArticles={totalArticles ?? 0}
            sourceLabel={sources.map((source) => source.name).join(", ")}
            categories={categories}
          />

          {error && (
            <p className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
              {error}
            </p>
          )}

          <section id="research-categories" aria-busy={loading} aria-live="polite">
            {categories.map((category, index) => (
              <TabsContent key={category.id} value={category.id}>
                <CategoryCard
                  category={category}
                  accent={CATEGORY_ACCENTS[category.id] ?? DEFAULT_ACCENT}
                  index={index}
                  loading={loading}
                />
              </TabsContent>
            ))}
          </section>
        </Tabs>

        <SourcesPanel sources={sources} />
      </div>
    </div>
  );
}
