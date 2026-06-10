import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";

export interface LegalLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
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
              {title}
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last updated: {updated}
            </p>
          </div>
        </section>
        <section className="container max-w-3xl space-y-6 py-12 text-slate-700 dark:text-slate-300 lg:py-16">
          {children}
        </section>
      </main>
      <SiteFooter />
    </div>
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
