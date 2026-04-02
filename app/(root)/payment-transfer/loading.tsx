import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentTransferLoading(): JSX.Element {
  return (
    <section className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Form + summary skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </section>
  );
}
