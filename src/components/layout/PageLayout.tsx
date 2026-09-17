import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  mainId,
}: {
  children: React.ReactNode;
  mainId?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-inverse">
      <SiteNav />
      <main id={mainId} className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export interface PageHeroProps {
  backLabel?: string;
  backTo?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  titleClassName?: string;
  metaClassName?: string;
}

export function PageHero({
  backLabel = "Back to overview",
  backTo = "/",
  title,
  description,
  meta,
  titleClassName,
  metaClassName,
}: PageHeroProps) {
  return (
    <section className="hero-band">
      <div className="container py-12 lg:py-16">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <h1
          className={cn(
            "mt-4 font-heading text-4xl font-semibold leading-tight text-ink dark:text-ink-inverse sm:text-5xl",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-lg text-ink-muted dark:text-ink-muted-dark">
            {description}
          </p>
        )}
        {meta && (
          <p
            className={cn(
              "mt-5 text-sm text-ink-muted dark:text-ink-muted-dark",
              metaClassName,
            )}
          >
            {meta}
          </p>
        )}
      </div>
    </section>
  );
}
