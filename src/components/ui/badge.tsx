import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-white/90 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20",
        outline:
          "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-white/40 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
