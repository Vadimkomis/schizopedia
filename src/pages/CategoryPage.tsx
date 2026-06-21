import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { ArticleCard } from "@/components/research/ArticleCard";
import { EvidenceLegend } from "@/components/research/EvidenceLegend";
import { SafetyPanel } from "@/components/research/SafetyPanel";
import { SourcesPanel } from "@/components/research/SourcesPanel";
import { SkeletonList } from "@/components/research/SkeletonList";
import {
  DEFAULT_SOURCES,
  FALLBACK_CATEGORIES,
} from "@/components/research/constants";
import { useResearchData } from "@/hooks/useResearchData";
import { useSeo } from "@/hooks/useSeo";
import { articleJsonLd } from "@/lib/seo";
import { formatDateTime } from "@/lib/format";

const VALID_IDS = new Set(FALLBACK_CATEGORIES.map((c) => c.id));
const CATEGORY_META = new Map(
  FALLBACK_CATEGORIES.map((c) => [c.id, { title: c.title, summary: c.summary }]),
);

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useResearchData();

  const valid = !!id && VALID_IDS.has(id);
  const meta = valid ? CATEGORY_META.get(id!) : undefined;
  useSeo({
    title: meta
      ? `Schizophrenia ${meta.title} Research — Latest Studies`
      : "Research",
    description: meta?.summary ?? "",
    path: valid ? `/category/${id}` : "/",
    jsonLd:
      valid && meta
        ? articleJsonLd({
            headline: `Schizophrenia ${meta.title} Research`,
            description: meta.summary,
            path: `/category/${id}`,
          })
        : undefined,
  });

  if (!valid) {
    return <Navigate to="/" replace />;
  }

  const categories = data?.categories?.length
    ? data.categories
    : FALLBACK_CATEGORIES;
  const category =
    categories.find((c) => c.id === id) ??
    FALLBACK_CATEGORIES.find((c) => c.id === id)!;
  const sources = data?.sources?.length ? data.sources : DEFAULT_SOURCES;
  const hasArticles = (category.articles?.length ?? 0) > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0b1220]">
      <SiteNav />
      <main className="flex-1">
        <section className="hero-band">
          <div className="container py-12 lg:py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to overview
            </Link>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              {category.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {category.summary}
            </p>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Last refreshed: {formatDateTime(data?.lastUpdated)}
              {hasArticles && (
                <>
                  {" · "}
                  {category.articles.length}{" "}
                  {category.articles.length === 1 ? "study" : "studies"}
                </>
              )}
            </p>
          </div>
        </section>

        <section className="container space-y-8 py-12 lg:py-16">
          <SafetyPanel />
          <EvidenceLegend />

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
              {error}
            </p>
          )}

          <div aria-busy={loading} aria-live="polite">
            {loading && !hasArticles ? (
              <SkeletonList />
            ) : hasArticles ? (
              <ol className="space-y-4">
                {category.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </ol>
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                No articles indexed for this category yet. Check back after the
                next refresh.
              </p>
            )}
          </div>

          <SourcesPanel sources={sources} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
