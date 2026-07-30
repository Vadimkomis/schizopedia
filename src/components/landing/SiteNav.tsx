import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DONATE_PATH } from "@/lib/links";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Ask AI", to: "/#ask" },
  { label: "Guides", to: "/#start-here" },
  { label: "Evidence", to: "/#categories" },
  { label: "Research", to: "/#highlights" },
];

const navLinkClass =
  "text-sm font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-200";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#19372f]/10 bg-[#fbfaf6]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1220]/90">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-[#17362d] transition hover:text-brand-700 dark:text-brand-100 dark:hover:text-brand-200"
          aria-label="Schizopedia home"
        >
          <span className="brand-glyph" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="font-heading text-2xl font-semibold tracking-tight">
            Schizopedia
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={navLinkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={DONATE_PATH}
            className="inline-flex items-center gap-2 rounded-full bg-[#17362d] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-brand-500 dark:hover:bg-brand-400 sm:px-4"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Support us</span>
            <span className="sm:hidden">Support</span>
          </Link>
          <ThemeToggle className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-full border border-[#19372f]/15 bg-white p-2 text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-brand-300/50 dark:hover:bg-brand-400/10 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-[#19372f]/10 bg-[#fbfaf6] dark:border-white/10 dark:bg-[#0b1220] md:hidden"
        >
          <div className="container flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={cn(navLinkClass, "rounded-lg px-2 py-2.5 text-base")}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between rounded-lg px-2 py-2.5">
              <span className="text-base font-medium text-slate-600 dark:text-slate-300">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
