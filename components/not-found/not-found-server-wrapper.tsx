/**
 * Server wrapper for the 404 Not Found page.
 * Render a minimal server-safe 404 UI to avoid including client-only
 * components during prerender. Keeps markup simple and link-based so
 * it can be prerendered safely in build environments.
 *
 * @export
 * @returns {JSX.Element}
 */
export function NotFoundServerWrapper(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <a
        href="/dashboard"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
