import { Skeleton } from "@/components/ui/skeleton";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @returns {JSX.Element}
 */
export default function MyBanksLoading(): JSX.Element {
  return (
    <section className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Bank cards grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>

      {/* Add bank button skeleton */}
      <Skeleton className="h-10 w-40 rounded-md" />
    </section>
  );
}
