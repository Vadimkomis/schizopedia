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
    <Card id="sources" className="glow-card border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f172a]">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          <div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              Sources and verification
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-white/80">
              We pull records from PubMed (NIH). Every card links to the
              original record so readers can verify claims and context.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.name}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
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
                className="ml-auto text-blue-700 transition hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
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
