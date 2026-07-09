import { PageHero, PageShell } from "@/components/layout/PageLayout";
import { SafetyPanel } from "@/components/research/SafetyPanel";
import { WorldPrevalence } from "@/components/prevalence/WorldPrevalence";

export function PrevalencePage() {
  return (
    <PageShell>
      <PageHero
        title="Schizophrenia around the world"
        description="How common is schizophrenia, and does it differ from country to country? Here is what the global data shows."
      />
      <section className="container max-w-4xl space-y-10 py-12 lg:py-16">
        <SafetyPanel />
        <WorldPrevalence />
      </section>
    </PageShell>
  );
}
