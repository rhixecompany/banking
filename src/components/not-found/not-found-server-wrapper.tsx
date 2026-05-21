/**
 * Not Found (404) page wrapper
 * Displays a centered 404 error message for non-existent pages
 */
export function NotFoundServerWrapper(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
    </div>
  );
}
