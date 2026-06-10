import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DONATE_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Research", to: "/#highlights" },
  { label: "Diagnosis", to: "/category/diagnosis" },
  { label: "Treatment", to: "/category/treatment" },
  { label: "Prevention", to: "/category/prevention" },
];

function navLinkClass({ isActive }: { isActive: boolean }, to: string) {
  return cn(
    "text-sm font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-200",
    isActive && !to.includes("#") && "text-brand-700 dark:text-brand-200",
  );
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0b1220]/90">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="font-heading text-2xl font-semibold text-brand-800 transition hover:text-brand-700 dark:text-brand-200 dark:hover:text-brand-100"
        >
          Schizopedia
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className={(state) => navLinkClass(state, item.to)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 sm:px-4"
          >
            <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
            Donate
          </a>
          <ThemeToggle className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-blue-300/50 dark:hover:bg-blue-400/10 md:hidden"
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
          className="border-t border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#0b1220] md:hidden"
        >
          <div className="container flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={(state) =>
                  cn(navLinkClass(state, item.to), "rounded-lg px-2 py-2.5 text-base")
                }
              >
                {item.label}
              </NavLink>
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
