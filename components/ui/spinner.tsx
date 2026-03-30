import { clsx } from "clsx";

/**
 * Loading spinner component for suspense fallbacks.
 * Uses Tailwind CSS for styling.
 *
 * @export
 * @param {Readonly<{ className?: string }>} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function LoadingSpinner({
  className,
}: Readonly<{
  className?: string;
}>): JSX.Element {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  );
}
