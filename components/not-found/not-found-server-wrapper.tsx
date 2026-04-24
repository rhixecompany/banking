/**
 * Not Found (404) page wrapper.
 */
export default function NotFoundServerWrapper(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
    </div>
  );
}
