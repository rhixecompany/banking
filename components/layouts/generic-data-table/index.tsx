"use client";

import type { JSX, ReactNode } from "react";

/**
 * Column definition for GenericDataTable.
 */
export interface GenericDataTableColumn<T> {
  /** Data key for the column. */
  key: keyof T;
  /** Column header label. */
  header: string;
  /** Optional custom cell render. */
  render?: (row: T) => ReactNode;
  /** Marks column as sortable (visual only in this minimal version). */
  sortable?: boolean;
  /** Optional cell class name for layout tweaks. */
  className?: string;
}

/**
 * Pagination configuration for GenericDataTable.
 */
export interface GenericDataTablePagination {
  /** Current page (1-based). */
  page: number;
  /** Page size used in the dataset. */
  pageSize: number;
  /** Total number of rows available. */
  total: number;
  /** Callback when the page changes. */
  onPageChange: (page: number) => void;
}

/**
 * Props for the GenericDataTable component.
 */
export interface GenericDataTableProps<T> {
  /** Array of rows to render. */
  data: T[];
  /** Column definitions. */
  columns: GenericDataTableColumn<T>[];
  /** Optional row click handler. */
  onRowClick?: (row: T) => void;
  /** Optional pagination controls. */
  pagination?: GenericDataTablePagination;
  /** Optional empty state message. */
  emptyMessage?: string;
  /** Additional CSS classes for the table container. */
  className?: string;
}

/**
 * GenericDataTable - Simple, type-safe table for small datasets.
 *
 * @example
 * ```tsx
 * <GenericDataTable
 *   data={users}
 *   columns={[
 *     { key: "name", header: "Name" },
 *     { key: "email", header: "Email" }
 *   ]}
 * />
 * ```
 */
export function GenericDataTable<T extends Record<string, unknown>>({
  className,
  columns,
  data,
  emptyMessage = "No data available",
  onRowClick,
  pagination,
}: GenericDataTableProps<T>): JSX.Element {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={[
                    "px-4 py-3 text-left font-semibold text-muted-foreground",
                    column.className,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="inline-flex items-center gap-2">
                    {column.header}
                    {column.sortable ? (
                      <span className="text-[10px] text-muted-foreground">
                        Sort
                      </span>
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/40" : ""
                  }
                  onClick={
                    onRowClick
                      ? () => {
                          onRowClick(row);
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={[
                        "border-t px-4 py-3 text-foreground",
                        column.className,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
          <span className="text-muted-foreground">
            Page {pagination.page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
            >
              First
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              Next
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              Last
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GenericDataTable;
