import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the my-wallets page.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function MyWalletsLoading(): JSX.Element {
  return (
    <section className="space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-36 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      {/* Wallet cards skeleton */}
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="ml-auto h-7 w-24" />
              </div>
            </div>
            <div className="grid gap-4 rounded-lg bg-muted p-4 sm:grid-cols-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-14 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
