import React from "react";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface Column
 * @typedef {Column}
 * @template [T=any]
 */
interface Column<T = any> {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  key: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  header: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(row: T) => React.ReactNode}
   */
  render?: (row: T) => React.ReactNode;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface DatatableProps
 * @typedef {DatatableProps}
 * @template [T=any]
 */
interface DatatableProps<T = any> {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {Column<T>[]}
   */
  columns: Column<T>[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {T[]}
   */
  rows: T[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  rowKey: string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @template T
 * @param {DatatableProps<T>} param0
 * @param {{}} param0.columns
 * @param {string} param0.rowKey
 * @param {{}} param0.rows
 * @returns {ReactJSX.Element}
 */
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
