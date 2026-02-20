export function SkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5"
        >
          <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
          <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-100 dark:bg-white/5" />
        </div>
      ))}
    </div>
  );
}
