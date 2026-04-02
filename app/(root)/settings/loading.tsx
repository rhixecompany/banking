import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading(): JSX.Element {
  return (
    <section className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Profile form skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Password form skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
    </section>
  );
}
