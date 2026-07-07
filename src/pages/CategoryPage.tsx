import { Navigate, useParams } from "react-router-dom";
import { CalendarClock, Sparkles } from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageLayout";
import { EvidenceLegend } from "@/components/research/EvidenceLegend";
import { ResearchSection } from "@/components/research/ResearchSection";
import { SafetyPanel } from "@/components/research/SafetyPanel";
import { SourcesPanel } from "@/components/research/SourcesPanel";
import { StateOfField } from "@/components/research/StateOfField";
import { SkeletonList } from "@/components/research/SkeletonList";
import {
  DEFAULT_SOURCES,
  FALLBACK_CATEGORIES,
} from "@/components/research/constants";
import { getCategoryContent, type CategoryContent } from "@/lib/categoryContent";
import {
  allArticles,
  filterByKeywords,
  rankByImportance,
  sortByPublishedDesc,
} from "@/lib/articles";
import { useResearchData } from "@/hooks/useResearchData";
import { formatDateTime } from "@/lib/format";
import type { ResearchArticle, ResearchCategory } from "@/lib/types";

const IMPORTANT_COUNT = 4;
const CITATION_COUNT = 3;

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useResearchData();
  const content = id ? getCategoryContent(id) : undefined;

  if (!id || !content) {
    return <Navigate to="/" replace />;
  }

  const categories = data?.categories?.length
    ? data.categories
    : FALLBACK_CATEGORIES;
  const sources = data?.sources?.length ? data.sources : DEFAULT_SOURCES;

  const pool = selectPool(content, categories);
  const ranked = rankByImportance(pool);
  const cited = selectCitations(ranked);
  const citedIds = new Set(cited.map((a) => a.id));
  const important = ranked
    .filter((a) => !citedIds.has(a.id))
    .slice(0, IMPORTANT_COUNT);
  const featuredIds = new Set([...citedIds, ...important.map((a) => a.id)]);
  const latest = sortByPublishedDesc(
    pool.filter((a) => !featuredIds.has(a.id)),
  );

  return (
    <PageShell>
      <PageHero
        title={content.title}
        description={content.summary}
        meta={
          <>
            Last refreshed: {formatDateTime(data?.lastUpdated)}
            {pool.length > 0 && (
              <>
                {" · "}
                {pool.length} {pool.length === 1 ? "study" : "studies"}
              </>
            )}
          </>
        }
      />

      <section className="container space-y-10 py-12 lg:py-16">
        <SafetyPanel />

        <StateOfField paragraphs={content.stateOfField} citations={cited} />

        <EvidenceLegend />

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </p>
        )}

        {loading && pool.length === 0 ? (
          <div aria-busy="true" aria-live="polite">
            <SkeletonList />
          </div>
        ) : (
          <div className="space-y-10">
            <ResearchSection
              id="important"
              icon={Sparkles}
              title="Most important research"
              description="The highest-quality studies currently indexed for this area — reviews and clinical evidence first."
              articles={important}
              emptyLabel="Key studies will appear here after the next refresh."
            />
            <ResearchSection
              id="latest"
              icon={CalendarClock}
              title="Latest research"
              description="The newest peer-reviewed studies, most recent first."
              articles={latest}
              emptyLabel="No further studies indexed yet. Check back after the next refresh."
            />
          </div>
        )}

        <SourcesPanel sources={sources} />
      </section>
    </PageShell>
  );
}

/** The article set a category draws from: its own feed, or a keyword-filtered
 *  slice of the whole dataset (for Cure, which has no dedicated feed). */
function selectPool(
  content: CategoryContent,
  categories: ResearchCategory[],
): ResearchArticle[] {
  if (content.pool === "cross") {
    return filterByKeywords(allArticles(categories), content.keywords ?? []);
  }
  return categories.find((c) => c.id === content.id)?.articles ?? [];
}

/** The studies that document the summary — prefer reviews/meta-analyses; fall
 *  back to the top-ranked studies so the summary is never left unsupported. */
function selectCitations(ranked: ResearchArticle[]): ResearchArticle[] {
  const reviews = ranked
    .filter((a) => a.evidenceLevel === "synthesis")
    .slice(0, CITATION_COUNT);
  if (reviews.length >= 2) return reviews;
  return ranked.slice(0, Math.min(2, ranked.length));
}
