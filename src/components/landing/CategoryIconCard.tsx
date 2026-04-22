import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryIconCardProps {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  tint: "mint" | "sky" | "violet" | "emerald";
}

const tintClass: Record<CategoryIconCardProps["tint"], string> = {
  mint: "tint-mint",
  sky: "tint-sky",
  violet: "tint-violet",
  emerald: "tint-emerald",
};

export function CategoryIconCard({
  title,
  description,
  to,
  icon: Icon,
  tint,
}: CategoryIconCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/10 dark:bg-[#0f172a]">
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          tintClass[tint],
        )}
      >
        <Icon className="h-7 w-7" aria-hidden="true" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 font-heading text-xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
      <div className="mt-auto pt-5">
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
        >
          Learn more
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
