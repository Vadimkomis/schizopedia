import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Microscope, Pill, Search, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { HeroSection } from "@/components/landing/HeroSection";
import {
  CategoryIconCard,
  type CategoryIconCardProps,
} from "@/components/landing/CategoryIconCard";
import { LatestHighlights } from "@/components/landing/LatestHighlights";
import { SubscribeSection } from "@/components/landing/SubscribeSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { FALLBACK_CATEGORIES } from "@/components/research/constants";
import { useResearchData } from "@/hooks/useResearchData";

type CategoryCardSpec = Omit<CategoryIconCardProps, "description" | "title"> & {
  fallbackTitle: string;
  fallbackDescription: string;
  categoryId: string | null;
};

const CATEGORY_CARDS: CategoryCardSpec[] = [
  {
    icon: Microscope,
    tint: "mint",
    to: "/#about",
    fallbackTitle: "Cure Research",
    fallbackDescription:
      "Discover the latest advances in understanding the causes of schizophrenia and the quest for a cure.",
    categoryId: null,
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
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0b1220]">
      <SiteNav />
      <main id="top" className="flex-1">
        <HeroSection
          totalArticles={totalArticles}
          lastUpdated={data?.lastUpdated ?? null}
        />

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

        <SubscribeSection />

        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  );
}
