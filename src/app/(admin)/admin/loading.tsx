import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the admin dashboard page.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function AdminLoading(): JSX.Element {
  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Statistics cards skeleton */}
        <div className="col-span-full grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>

        {/* Widget cards skeleton */}
        <div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* Chart skeleton */}
        <Skeleton className="col-span-full h-72 w-full rounded-xl xl:col-span-2" />

        {/* Datatable skeleton */}
        <div className="col-span-full space-y-2 rounded-xl border py-4">
          <Skeleton className="mx-4 h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mx-4 h-12 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
