import React from "react";

/**
 * PageShell - Layout wrapper for authenticated pages.
 * Provides consistent page structure with header and main content area.
 *
 * @description
 * Wraps authenticated page content in a standard layout shell with a header
 * containing the page title and a content area. Used by RootLayoutWrapper
 * for all protected routes.
 *
 * @example
 * ```tsx
 * <PageShell title="Dashboard">
 *   <DashboardContent />
 * </PageShell>
 * ```
 *
 * @param props - Component props
 * @param props.title - Page title displayed in the header
 * @param props.children - Page content to render
 * @returns Layout shell with header and content
 */
interface PageShellProps {
  /** Page title displayed in the header */
  title?: string;
  /** Page content to render */
  children?: React.ReactNode;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {PageShellProps} param0
 * @param {string} param0.title
 * @param {React.ReactNode} param0.children
 * @returns {ReactJSX.Element}
 */
export default function PageShell({ children, title }: PageShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
