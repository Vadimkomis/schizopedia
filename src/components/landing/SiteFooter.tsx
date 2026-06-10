import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { SubscribeForm } from "@/components/landing/SubscribeForm";
import { DONATE_URL } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1220]">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-semibold text-brand-800 dark:text-brand-200">
            Schizopedia
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Knowledge today. Better tomorrows.
          </p>
          <SubscribeForm compact className="mt-4" />
        </div>

        <nav
          aria-label="Legal"
          className="flex items-center gap-5 text-sm text-slate-600 dark:text-slate-300"
        >
          <Link to="/privacy" className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Privacy
          </Link>
          <span className="text-slate-300 dark:text-white/20" aria-hidden="true">|</span>
          <Link to="/terms" className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Terms &amp; Conditions
          </Link>
        </nav>

        <a
          href={DONATE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 md:self-auto"
        >
          <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
          Donate
        </a>
      </div>
    </footer>
  );
}
