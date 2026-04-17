import React from "react";

interface Column<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DatatableProps<T = any> {
  columns: Column<T>[];
  rows: T[];
  rowKey: string;
}

export default function Datatable<T>({
  columns,
  rowKey,
  rows,
}: DatatableProps<T>) {
  return (
    <table className="datatable">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={(row as any)[rowKey]}>
            {columns.map((c) => (
              <td key={c.key}>
                {c.render ? c.render(row) : (row as any)[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
