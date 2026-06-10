import { CalendarClock } from "lucide-react";
import { SubscribeForm } from "@/components/landing/SubscribeForm";

export function SubscribeSection() {
  return (
    <section
      id="subscribe"
      aria-labelledby="subscribe-heading"
      className="container py-14 lg:py-16 scroll-mt-20"
    >
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-8 dark:border-white/10 dark:from-brand-900/30 dark:to-transparent lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Weekly digest
            </p>
            <h2
              id="subscribe-heading"
              className="font-heading text-3xl font-semibold text-slate-900 dark:text-white"
            >
              New research lands every Monday.
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              The feed refreshes automatically from PubMed every Monday
              morning. Subscribe to get the week&apos;s new schizophrenia
              studies in your inbox when email delivery launches.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}
