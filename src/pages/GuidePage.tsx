import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Info, TriangleAlert } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { getAdjacentGuides, getGuide, type GuideSection } from "@/lib/guides";
import { useSeo } from "@/hooks/useSeo";
import { articleJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const guide = getGuide(id);

  useSeo({
    title: guide ? `${guide.title} — Schizophrenia Guide` : "Guide",
    description: guide?.description ?? "",
    path: guide ? `/guide/${guide.id}` : "/",
    type: "article",
    jsonLd: guide
      ? articleJsonLd({
          headline: guide.title,
          description: guide.description,
          path: `/guide/${guide.id}`,
        })
      : undefined,
  });

  if (!guide) {
    return <Navigate to="/" replace />;
  }

  const { previous, next } = getAdjacentGuides(guide.id);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0b1220]">
      <SiteNav />
      <main className="flex-1">
        <section className="hero-band">
          <div className="container py-12 lg:py-16">
            <Link
              to="/#start-here"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All guides
            </Link>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {guide.description}
            </p>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {guide.readingMinutes} min read
            </p>
          </div>
        </section>

        <article className="container max-w-3xl space-y-10 py-12 lg:py-16">
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            This guide is for learning and preparing questions — it is not
            medical advice, and it can&apos;t replace an assessment by a
            licensed clinician.
          </p>

          {guide.sections.map((section) => (
            <GuideSectionBlock key={section.heading} section={section} />
          ))}

          <nav
            aria-label="Guide navigation"
            className="flex flex-col gap-3 border-t border-slate-200 pt-8 dark:border-white/10 sm:flex-row sm:justify-between"
          >
            {previous ? (
              <Link
                to={`/guide/${previous.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
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
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
              >
                {next.shortTitle}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function GuideSectionBlock({ section }: { section: GuideSection }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
        {section.heading}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="leading-relaxed text-slate-700 dark:text-slate-300"
        >
          {paragraph}
        </p>
      ))}
      {section.bullets && (
        <ul className="list-disc space-y-2 pl-6 text-slate-700 marker:text-brand-500 dark:text-slate-300">
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
