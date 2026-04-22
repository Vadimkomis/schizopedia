import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Research", to: "/#highlights" },
  { label: "Diagnosis", to: "/category/diagnosis" },
  { label: "Treatment", to: "/category/treatment" },
  { label: "Prevention", to: "/category/prevention" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0b1220]/90">
      <div className="container flex h-16 items-center justify-between gap-6">
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
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-200",
                  isActive &&
                    !item.to.includes("#") &&
                    "text-brand-700 dark:text-brand-200",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle className="hidden md:inline-flex" />
      </div>
    </header>
  );
}
