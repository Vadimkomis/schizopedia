export function SkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-xl border border-line bg-surface-subtle px-6 py-4 text-sm text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark"
        >
          <div className="h-4 w-3/4 rounded-full bg-line dark:bg-line-dark" />
          <div className="mt-3 h-3 w-1/2 rounded-full bg-surface dark:bg-surface-dark" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-surface dark:bg-surface-dark" />
        </div>
      ))}
    </div>
  );
}
