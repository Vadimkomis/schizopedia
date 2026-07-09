import { Link } from "react-router-dom";
import { DONATE_PATH } from "@/lib/links";

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
        </div>

        <nav
          aria-label="Legal"
          className="flex items-center gap-5 text-sm text-slate-600 dark:text-slate-300"
        >
          <Link to="/prevalence" className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Worldwide data
          </Link>
          <span className="text-slate-300 dark:text-white/20" aria-hidden="true">|</span>
          <Link to={DONATE_PATH} className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Donate
          </Link>
          <span className="text-slate-300 dark:text-white/20" aria-hidden="true">|</span>
          <Link to="/privacy" className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Privacy
          </Link>
          <span className="text-slate-300 dark:text-white/20" aria-hidden="true">|</span>
          <Link to="/terms" className="transition hover:text-brand-700 dark:hover:text-brand-200">
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
