import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Loading skeleton for protected pages (dashboard, settings, etc.).
 * Displayed while the Suspense boundary resolves the auth check.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function ProtectedLoading(): JSX.Element {
  return (
    <main className="flex h-screen w-full font-inter">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r border-gray-200 bg-gray-50 p-4 lg:block">
        <div className="space-y-4">
          {/* Logo skeleton */}
          <div className="flex items-center gap-2">
            <div className="size-8 animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded-sm bg-gray-200" />
          </div>
          {/* Navigation skeleton */}
          <div className="mt-8 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Main content area with centered spinner */}
      <div className="flex flex-1 flex-col">
        {/* Header skeleton */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="h-6 w-32 animate-pulse rounded-sm bg-gray-200" />
          <div className="size-10 animate-pulse rounded-full bg-gray-200" />
        </div>
        {/* Content area with spinner */}
        <div className="flex-center flex-1">
          <LoadingSpinner className="size-12" />
        </div>
      </div>
    </main>
  );
}
