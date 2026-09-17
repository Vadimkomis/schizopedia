import { ExternalLink, Globe, Info } from "lucide-react";
import {
  barWidth,
  countriesByPrevalenceDesc,
  formatPercent,
  prevalence,
} from "@/lib/prevalence";

/**
 * "Schizophrenia around the world" — the solid WHO global figure up top, then
 * modelled per-country estimates. The story the data actually tells is
 * uniformity: schizophrenia affects a strikingly similar share of people
 * everywhere, unlike most conditions.
 */
export function WorldPrevalence() {
  const { global: g, estimatesSource } = prevalence;
  const countries = countriesByPrevalenceDesc();
  const max = Math.max(...countries.map((c) => c.percent));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <GlobalStat value={`1 in ${g.oneIn}`} label="people live with schizophrenia" />
        <GlobalStat value={`~${g.affectedMillions} million`} label="people affected worldwide" />
        <GlobalStat value={`~${formatPercent(g.percent)}`} label="of the global population" />
      </div>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
        Global figures:{" "}
        <a
          href={g.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-accent underline hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
        >
          {g.source}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-ink-muted dark:border-blue-300/30 dark:bg-blue-400/10 dark:text-ink-muted-dark">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
        <p>{estimatesSource.note}</p>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-ink dark:text-ink-inverse">
          Estimated prevalence by country
        </h3>
        <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
          Age-standardized modelled estimates. Notice how close the numbers
          stay to one another — that consistency is the headline.
        </p>
        <ul className="mt-5 space-y-2.5">
          {countries.map((country) => (
            <li key={country.code} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-sm text-ink-muted dark:text-ink-muted-dark">
                {country.name}
              </span>
              <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-subtle dark:bg-surface-dark-subtle">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-accent dark:bg-accent-dark"
                  style={{ width: `${barWidth(country.percent, max)}%` }}
                />
              </span>
              <span className="w-14 shrink-0 text-right text-sm tabular-nums text-ink-muted dark:text-ink-muted-dark">
                {formatPercent(country.percent)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
        <span className="inline-flex items-center gap-1.5">
          <Globe className="h-4 w-4" aria-hidden="true" />
          Country estimates:
        </span>{" "}
        <a
          href={estimatesSource.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-accent underline hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
        >
          {estimatesSource.name}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}

function GlobalStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark">
      <p className="font-heading text-3xl font-semibold text-accent dark:text-accent-dark">
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">{label}</p>
    </div>
  );
}
