import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResearchSource } from "@/lib/types";
import { TrendingUp } from "lucide-react";

export function SourcesPanel({ sources }: { sources: ResearchSource[] }) {
  return (
    <Card className="glow-card border-white/70 bg-white/90 dark:border-white/10 dark:bg-slate-900/70">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
          <div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              Where this research comes from
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-white/80">
              All articles are sourced from PubMed, the National Institutes of
              Health's free database of medical research.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.name}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {source.name}
                </p>
                {source.description && (
                  <p className="text-slate-600 dark:text-white/70">
                    {source.description}
                  </p>
                )}
              </div>
              <a
                className="ml-auto text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit source
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
