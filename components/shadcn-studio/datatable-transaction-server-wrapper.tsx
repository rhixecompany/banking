import type { Item } from "@/components/shadcn-studio/blocks/datatable-transaction";

import TransactionDatatable from "@/components/shadcn-studio/blocks/datatable-transaction";

/**
 * Props for DatatableTransactionServerWrapper.
 *
 * @interface DatatableTransactionServerWrapperProps
 */
interface DatatableTransactionServerWrapperProps {
  /** Rows to display in the datatable. */
  data: Item[];
}

/**
 * Server wrapper for the Datatable Transaction shadcn-studio block.
 *
 * @export
 * @param {DatatableTransactionServerWrapperProps} props
 * @returns {JSX.Element}
 */
export function DatatableTransactionServerWrapper({
  data,
}: DatatableTransactionServerWrapperProps): JSX.Element {
  return <TransactionDatatable data={data} />;
}
