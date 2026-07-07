import { PageHero, PageShell } from "@/components/layout/PageLayout";

export interface LegalLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <PageShell>
      <PageHero title={title} meta={`Last updated: ${updated}`} />
      <section className="container max-w-3xl space-y-6 py-12 text-slate-700 dark:text-slate-300 lg:py-16">
        {children}
      </section>
    </PageShell>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
        {heading}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
