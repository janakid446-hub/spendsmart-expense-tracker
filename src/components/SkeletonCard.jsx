export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} className="h-28" />
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} className="h-24" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return <SkeletonCard className="h-64 w-full md:h-80" />;
}

export function SkeletonTransactionList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className="h-20" />
      ))}
    </div>
  );
}
