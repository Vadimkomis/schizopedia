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
  "text-base text-ink transition hover:text-accent dark:text-ink-inverse dark:hover:text-accent-dark";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur dark:bg-canvas-dark/95">
      <div className="grid h-24 grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-8 md:h-28 md:grid-cols-[1fr_auto_1fr] lg:px-16 xl:px-20">
        <Link
          to="/"
          className="group inline-flex w-fit items-center gap-2 text-ink transition hover:text-accent dark:text-ink-inverse dark:hover:text-accent-dark sm:gap-2.5"
          aria-label="Schizopedia home"
        >
          <span className="brand-glyph" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight sm:text-3xl">
            Schizopedia
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex lg:gap-12">
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

        <div className="flex items-center justify-self-end gap-2 sm:gap-4">
          <ThemeToggle className="hidden border-transparent bg-transparent text-ink-muted hover:border-transparent dark:border-transparent dark:bg-transparent md:inline-flex" />
          <Link
            to={DONATE_PATH}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:bg-accent-dark dark:text-canvas-dark dark:hover:bg-accent-dark-hover dark:focus-visible:ring-accent-dark sm:px-7 sm:py-3 sm:text-base"
          >
            Donate
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface-subtle dark:text-ink-muted-dark dark:hover:bg-surface-dark-subtle md:hidden"
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
