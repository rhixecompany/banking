import { Skeleton } from "@/components/ui/skeleton";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @returns {JSX.Element}
 */
export default function TransactionHistoryLoading(): JSX.Element {
  return (
    <section className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-md" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </section>
  );
}
