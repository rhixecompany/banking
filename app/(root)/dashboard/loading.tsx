import { Skeleton } from "@/components/ui/skeleton";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @returns {JSX.Element}
 */
export default function DashboardLoading(): JSX.Element {
  return (
    <section className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>

      {/* Sales metrics skeleton */}
      <Skeleton className="h-64 w-full rounded-xl" />

      {/* Lower grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl md:col-span-2" />
      </div>
    </section>
  );
}
