import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Loading skeleton for auth pages (sign-in, sign-up).
 * Displayed while the Suspense boundary resolves the session check.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function AuthLoading(): JSX.Element {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {/* Main content area with spinner */}
      <div className="flex-center size-full">
        <LoadingSpinner className="size-10" />
      </div>
      {/* Auth image placeholder */}
      <div className="auth-asset hidden lg:block">
        <div className="flex size-full items-center justify-center bg-gray-100">
          <LoadingSpinner className="size-12" />
        </div>
      </div>
    </main>
  );
}
