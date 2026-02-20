import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ResearchCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";
import { SkeletonList } from "./SkeletonList";

export function CategoryCard({
  category,
  accent,
  loading,
  index,
}: {
  category: ResearchCategory;
  accent: { light: string; dark: string };
  loading: boolean;
  index: number;
}) {
  const hasArticles = category.articles?.length > 0;
  return (
    <Card
      className={cn(
        "glow-card h-full border-transparent bg-gradient-to-br from-white/90 via-white to-white p-0 dark:from-slate-900/60 dark:via-slate-900/30 dark:to-slate-900/10",
        "bg-gradient-to-br",
        accent.light,
        accent.dark,
      )}
    >
      <CardHeader className="border-b border-slate-100 px-6 pb-6 pt-6 dark:border-white/5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{category.title}</Badge>
          <span className="text-xs uppercase tracking-[0.4em] text-slate-300 dark:text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <CardTitle className="text-2xl text-slate-900 dark:text-white">
          {category.summary}
        </CardTitle>
        <CardDescription className="text-base text-slate-600 dark:text-white/80">
          {hasArticles
            ? `${category.articles.length} highlighted studies`
            : "Coming soon — check back after our next update"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        {loading && !hasArticles ? (
          <SkeletonList />
        ) : hasArticles ? (
          <ScrollArea className="max-h-[60vh] pr-2">
            <ol className="space-y-4">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </ol>
          </ScrollArea>
        ) : (
          <p className="text-sm text-slate-600 dark:text-white/70">
            No articles found yet. Check back after the next weekly update.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
