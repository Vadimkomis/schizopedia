import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowseTopics } from "@/components/landing/BrowseTopics";
import { HeroSection } from "@/components/landing/HeroSection";
import { LatestHighlights } from "@/components/landing/LatestHighlights";
import { PageShell } from "@/components/layout/PageLayout";
import { useResearchData } from "@/hooks/useResearchData";

export function LandingPage() {
  const { data, loading, error } = useResearchData();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hash, loading]);

  const categories = data?.categories ?? [];

  return (
    <PageShell mainId="top">
      <HeroSection categories={categories} loading={loading} error={error} />
      <BrowseTopics />
      <LatestHighlights categories={categories} loading={loading} />
    </PageShell>
  );
}
