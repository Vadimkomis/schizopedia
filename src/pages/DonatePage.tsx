import { Heart, Mail, ShieldCheck, Share2 } from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageLayout";
import { externalDonateUrl, supportMailto } from "@/lib/links";

export function DonatePage() {
  const donateUrl = externalDonateUrl();
  const hasProcessor = donateUrl.length > 0;

  return (
    <PageShell>
      <PageHero
        title="Support Schizopedia"
        description="Schizopedia is free, ad-free, and collects no personal data. Reader support keeps it that way."
      />

      <section className="container max-w-3xl space-y-8 py-12 lg:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#0f172a] sm:p-8">
          <p className="text-slate-600 dark:text-slate-300">
            Every study on this site is pulled straight from PubMed and
            translated into plain language for families and caregivers. There
            are no ads, no trackers, and no paywall. If Schizopedia has helped
            you, a contribution helps cover hosting and the time it takes to
            keep the research current.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {hasProcessor ? (
              <a
                href={donateUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
              >
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                Donate now
              </a>
            ) : (
              <a
                href={supportMailto()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Get in touch to contribute
              </a>
            )}
          </div>

          {!hasProcessor && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Online donations are launching soon. In the meantime, email us and
              we&apos;ll set it up with you directly.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SupportPoint icon={ShieldCheck} title="No ads, no trackers">
            Your support — not advertisers — keeps the site independent and
            private.
          </SupportPoint>
          <SupportPoint icon={Heart} title="Always free to read">
            Every guide and study stays free for the families who need it.
          </SupportPoint>
          <SupportPoint icon={Share2} title="Sharing helps too">
            Can&apos;t give right now? Sharing Schizopedia with someone who needs
            it helps just as much.
          </SupportPoint>
        </div>
      </section>
    </PageShell>
  );
}

function SupportPoint({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Heart;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full tint-sky">
        <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
      </span>
      <h2 className="mt-3 font-heading text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </div>
  );
}
