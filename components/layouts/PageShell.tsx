import React from "react";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {PageShellProps}
 */
type PageShellProps = {
  title?: string;
  children?: React.ReactNode;
};

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
export default function PageShell({ title, children }: PageShellProps) {
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
