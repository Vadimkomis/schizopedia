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
      <section className="container max-w-3xl space-y-6 py-12 text-ink-muted dark:text-ink-muted-dark lg:py-16">
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
      <h2 className="font-heading text-xl font-semibold text-ink dark:text-ink-inverse">
        {heading}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
