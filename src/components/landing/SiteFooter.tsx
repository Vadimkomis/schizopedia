import { Link } from "react-router-dom";
import { DONATE_PATH } from "@/lib/links";

const footerLinks = [
  { label: "Guides", to: "/guide/what-is-schizophrenia" },
  { label: "Prevalence", to: "/prevalence" },
  { label: "Donate", to: DONATE_PATH },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
      <div className="container flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-semibold text-ink dark:text-ink-inverse">Schizopedia</p>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
            Knowledge today. Better tomorrows.
          </p>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
            Educational information, not medical advice.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted dark:text-ink-muted-dark">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-accent dark:hover:text-accent-dark">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
