import { Badge } from "@/components/ui/badge";

const LEVELS = [
  {
    label: "Higher-level synthesis",
    description:
      "Meta-analyses and systematic reviews that combine many studies. The strongest signal available.",
  },
  {
    label: "Clinical evidence",
    description:
      "Trials and observational studies in people. Solid, but single studies can still be overturned.",
  },
  {
    label: "Early-stage evidence",
    description:
      "Preclinical work, case reports, and first findings. Interesting leads, not yet settled science.",
  },
];

export function EvidenceLegend() {
  return (
    <section
      aria-labelledby="evidence-legend-heading"
      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/5"
    >
      <h2
        id="evidence-legend-heading"
        className="font-heading text-base font-semibold text-slate-900 dark:text-white"
      >
        How to read the evidence badges
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Every study is labeled by how much weight its findings carry, based on
        the publication type reported by PubMed.
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => (
          <li key={level.label} className="space-y-1.5">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-300/30 dark:bg-blue-400/10 dark:text-blue-200">
              {level.label}
            </Badge>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {level.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
