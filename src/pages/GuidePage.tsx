import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Info, TriangleAlert } from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageLayout";
import { getAdjacentGuides, getGuide, type GuideSection } from "@/lib/guides";
import { TEXT_ACTION_LINK_CLASS } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const guide = getGuide(id);

  if (!guide) {
    return <Navigate to="/" replace />;
  }

  const { previous, next } = getAdjacentGuides(guide.id);

  return (
    <PageShell>
      <PageHero
        backLabel="Back home"
        backTo="/"
        title={guide.title}
        titleClassName="max-w-3xl"
        description={guide.description}
        meta={
          <>
            <Clock className="h-4 w-4" aria-hidden="true" />
            {guide.readingMinutes} min read
          </>
        }
        metaClassName="inline-flex items-center gap-1.5"
      />

      <article className="container max-w-3xl space-y-10 py-12 lg:py-16">
        <p className="rounded-xl border border-line bg-surface-subtle px-5 py-4 text-sm text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark">
          This guide is for learning and preparing questions — it is not
          medical advice, and it can&apos;t replace an assessment by a licensed
          clinician.
        </p>

        {guide.sections.map((section) => (
          <GuideSectionBlock key={section.heading} section={section} />
        ))}

        <nav
          aria-label="Guide navigation"
          className="flex flex-col gap-3 border-t border-line pt-8 dark:border-line-dark sm:flex-row sm:justify-between"
        >
          {previous ? (
            <Link
              to={`/guide/${previous.id}`}
              className={TEXT_ACTION_LINK_CLASS}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {previous.shortTitle}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/guide/${next.id}`}
              className={TEXT_ACTION_LINK_CLASS}
            >
              {next.shortTitle}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </article>
    </PageShell>
  );
}

function GuideSectionBlock({ section }: { section: GuideSection }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-ink dark:text-ink-inverse">
        {section.heading}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="leading-relaxed text-ink-muted dark:text-ink-muted-dark"
        >
          {paragraph}
        </p>
      ))}
      {section.bullets && (
        <ul className="list-disc space-y-2 pl-6 text-ink-muted marker:text-accent dark:text-ink-muted-dark dark:marker:text-accent-dark">
          {section.bullets.map((bullet) => (
            <li key={bullet.slice(0, 40)} className="leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {section.callout && (
        <p
          className={cn(
            "flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm leading-relaxed",
            section.callout.tone === "warning"
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100"
              : "border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-300/30 dark:bg-brand-400/10 dark:text-brand-100",
          )}
        >
          {section.callout.tone === "warning" ? (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {section.callout.text}
        </p>
      )}
    </section>
  );
}
