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
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Global figures:{" "}
        <a
          href={g.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-brand-700 underline hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          {g.source}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-slate-700 dark:border-brand-300/30 dark:bg-brand-900/20 dark:text-slate-200">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
        <p>{estimatesSource.note}</p>
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
          Estimated prevalence by country
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Age-standardized modelled estimates. Notice how close the numbers
          stay to one another — that consistency is the headline.
        </p>
        <ul className="mt-5 space-y-2.5">
          {countries.map((country) => (
            <li key={country.code} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-sm text-slate-700 dark:text-slate-200">
                {country.name}
              </span>
              <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-brand-500 dark:bg-brand-400"
                  style={{ width: `${barWidth(country.percent, max)}%` }}
                />
              </span>
              <span className="w-14 shrink-0 text-right text-sm tabular-nums text-slate-600 dark:text-slate-300">
                {formatPercent(country.percent)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Globe className="h-4 w-4" aria-hidden="true" />
          Country estimates:
        </span>{" "}
        <a
          href={estimatesSource.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-brand-700 underline hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0f172a]">
      <p className="font-heading text-3xl font-semibold text-brand-700 dark:text-brand-200">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
