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
    <Card id="sources">
      <CardHeader className="px-6 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <TrendingUp className="h-5 w-5 text-accent dark:text-accent-dark" />
          <div>
            <CardTitle className="text-2xl text-ink dark:text-ink-inverse">
              Sources and verification
            </CardTitle>
            <CardDescription className="text-ink-muted dark:text-ink-muted-dark">
              We pull records from PubMed (NIH). Every card links to the
              original record so readers can verify claims and context.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-4 px-6 pb-6">
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.name}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface-subtle p-5 dark:border-line-dark dark:bg-surface-dark-subtle"
            >
              <div>
                <p className="font-medium text-ink dark:text-ink-inverse">
                  {source.name}
                </p>
                {source.description && (
                  <p className="text-ink-muted dark:text-ink-muted-dark">
                    {source.description}
                  </p>
                )}
              </div>
              <a
                className="ml-auto text-accent transition hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
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
