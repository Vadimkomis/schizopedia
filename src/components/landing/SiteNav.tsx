import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DONATE_PATH } from "@/lib/links";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Browse", to: "/#topics" },
  { label: "Guides", to: "/guide/what-is-schizophrenia" },
];

const navLinkClass =
  "text-sm font-medium text-ink-muted transition hover:text-accent dark:text-ink-muted-dark dark:hover:text-accent-dark";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur dark:border-line-dark dark:bg-surface-dark/95">
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
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:bg-accent-dark dark:text-canvas-dark dark:hover:bg-accent-dark-hover dark:focus-visible:ring-accent-dark"
          >
            Support
          </Link>
          <ThemeToggle className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-xl border border-line bg-surface p-2 text-ink-muted transition hover:bg-surface-subtle dark:border-line-dark dark:bg-surface-dark dark:text-ink-muted-dark dark:hover:bg-surface-dark-subtle md:hidden"
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
          className="border-t border-line bg-surface dark:border-line-dark dark:bg-surface-dark md:hidden"
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
              <span className="text-base font-medium text-ink-muted dark:text-ink-muted-dark">
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
