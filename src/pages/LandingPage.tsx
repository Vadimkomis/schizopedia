import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Globe, Microscope, Pill, Search, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import {
  CategoryIconCard,
  type CategoryIconCardProps,
} from "@/components/landing/CategoryIconCard";
import { LatestHighlights } from "@/components/landing/LatestHighlights";
import { StartHereSection } from "@/components/landing/StartHereSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FALLBACK_CATEGORIES } from "@/components/research/constants";
import { useResearchData } from "@/hooks/useResearchData";
import { formatPercent, prevalence } from "@/lib/prevalence";

type CategoryCardSpec = Omit<CategoryIconCardProps, "description" | "title"> & {
  fallbackTitle: string;
  fallbackDescription: string;
  categoryId: string | null;
};

const CATEGORY_CARDS: CategoryCardSpec[] = [
  {
    icon: Microscope,
    tint: "mint",
    to: "/category/cure",
    fallbackTitle: "Cure Research",
    fallbackDescription:
      "Discover the latest advances in understanding the causes of schizophrenia and the quest for a cure.",
    categoryId: "cure",
  },
  {
    icon: Search,
    tint: "sky",
    to: "/category/diagnosis",
    fallbackTitle: "Diagnosis",
    fallbackDescription:
      "Learn about innovative tools and biomarkers improving early and accurate diagnosis.",
    categoryId: "diagnosis",
  },
  {
    icon: Pill,
    tint: "violet",
    to: "/category/treatment",
    fallbackTitle: "Treatment",
    fallbackDescription:
      "Explore emerging therapies, medications, and approaches improving quality of life.",
    categoryId: "treatment",
  },
  {
    icon: ShieldCheck,
    tint: "emerald",
    to: "/category/prevention",
    fallbackTitle: "Prevention",
    fallbackDescription:
      "Stay informed on research focused on reducing risk factors and promoting brain health.",
    categoryId: "prevention",
  },
];

export function LandingPage() {
  const { data, loading } = useResearchData();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, loading]);

  const categories = data?.categories?.length
    ? data.categories
    : FALLBACK_CATEGORIES;
  const categoriesById = new Map(categories.map((c) => [c.id, c]));

  const totalArticles = categories.reduce(
    (sum, c) => sum + (c.articles?.length ?? 0),
    0,
  );

  return (
    <PageShell mainId="top">
      <HeroSection
        totalArticles={totalArticles}
        lastUpdated={data?.lastUpdated ?? null}
      />

      <StartHereSection />

      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="container py-14 lg:py-16 scroll-mt-20"
      >
        <h2 id="categories-heading" className="sr-only">
          Research categories
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((spec) => {
            const backing = spec.categoryId
              ? categoriesById.get(spec.categoryId)
              : undefined;
            return (
              <CategoryIconCard
                key={spec.fallbackTitle}
                icon={spec.icon}
                tint={spec.tint}
                to={spec.to}
                title={backing?.title ?? spec.fallbackTitle}
                description={backing?.summary ?? spec.fallbackDescription}
              />
            );
          })}
        </div>
      </section>

      <LatestHighlights categories={categories} loading={loading} />

      <WorldPrevalenceTeaser />

      <AboutSection />
    </PageShell>
  );
}

function WorldPrevalenceTeaser() {
  const { global: g } = prevalence;
  return (
    <section
      aria-labelledby="worldwide-heading"
      className="container py-14 lg:py-16"
    >
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-8 dark:border-white/10 dark:from-brand-900/30 dark:to-transparent lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
              <Globe className="h-4 w-4" aria-hidden="true" />
              Around the world
            </p>
            <h2
              id="worldwide-heading"
              className="font-heading text-3xl font-semibold text-slate-900 dark:text-white"
            >
              About 1 in {g.oneIn} people live with schizophrenia — almost
              everywhere on Earth.
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Roughly {g.affectedMillions} million people worldwide, about{" "}
              {formatPercent(g.percent)} of the population. Remarkably, the rate
              stays close to that number from country to country.
            </p>
            <Link
              to="/prevalence"
              className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              See prevalence by country
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <dl className="grid grid-cols-3 gap-4">
            <TeaserStat value={`1 in ${g.oneIn}`} label="people" />
            <TeaserStat value={`~${g.affectedMillions}M`} label="worldwide" />
            <TeaserStat value={`~${formatPercent(g.percent)}`} label="of people" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function TeaserStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/90 px-3 py-4 text-center dark:border-white/10 dark:bg-white/5">
      <dt className="order-2 text-xs text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="order-1 font-heading text-xl font-semibold text-brand-700 dark:text-brand-200">
        {value}
      </dd>
    </div>
  );
}
