"use client";

import type { Item } from "@/components/shadcn-studio/blocks/datatable-transaction";

import TransactionDatatable from "@/components/shadcn-studio/blocks/datatable-transaction";

/**
 * Props for DatatableTransactionClientWrapper.
 *
 * @interface DatatableTransactionClientWrapperProps
 */
interface DatatableTransactionClientWrapperProps {
  /** Rows to display in the datatable. */
  data: Item[];
}

/**
 * Client wrapper for the Datatable Transaction shadcn-studio block.
 *
 * @export
 * @param {DatatableTransactionClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function DatatableTransactionClientWrapper({
  data,
}: DatatableTransactionClientWrapperProps): JSX.Element {
  return <TransactionDatatable data={data} />;
}
