"use client";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";

/**
 * Description placeholder
 *
 * @export
 * @typedef {Item}
 */
export interface Item {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  avatar: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  avatarFallback: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  amount: number;
  /**
   * Description placeholder
   *
   * @type {("failed" | "paid" | "pending" | "processing")}
   */
  status: "failed" | "paid" | "pending" | "processing";
  /**
   * Description placeholder
   *
   * @type {("mastercard" | "visa")}
   */
  paidBy: "mastercard" | "visa";
}

/**
 * Description placeholder
 *
 * @type {ColumnDef<Item>[]}
 */
export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarImage src={row.original.avatar} alt="Hallie Richards" />
          <AvatarFallback className="text-xs">
            {row.original.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="font-medium text-card-foreground">
            {row.getValue("name")}
          </span>
          <span className="text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
    header: "Customer",
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(amount);

      return <span>{formatted}</span>;
    },
    header: "Amount",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge className="rounded-sm bg-primary/10 px-1.5 text-primary capitalize">
        {row.getValue("status")}
      </Badge>
    ),
    header: "Status",
  },
  {
    accessorKey: "paidBy",
    cell: ({ row }) => (
      <Image
        src={
          row.getValue("paidBy") === "mastercard"
            ? "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png"
            : "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png"
        }
        alt="Payment platform"
        width={42}
        height={28}
        className="w-10.5"
      />
    ),
    header: () => <span className="w-fit">Paid by</span>,
  },
  {
    cell: () => <RowActions />,
    enableHiding: false,
    header: () => "Actions",
    id: "actions",
    size: 60,
  },
];

/**
 * Description placeholder
 *
 * @param {{ data: Item[] }} param0
 * @param {{}} param0.data
 * @returns {*}
 */
const TransactionDatatable = ({ data }: { data: Item[] }): JSX.Element => {
  const pageSize = 5;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    paginationItemsToDisplay: 2,
    totalPages: table.getPageCount(),
  });

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-14 text-muted-foreground first:ps-4"
                    >
                      {header.isPlaceholder
                        ? undefined
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:ps-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
        <p
          className="text-sm whitespace-nowrap text-muted-foreground"
          aria-live="polite"
        >
          Showing{" "}
          <span>
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0,
              ),
              table.getRowCount(),
            )}
          </span>{" "}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map((page) => {
                const isActive =
                  page === table.getState().pagination.pageIndex + 1;

                return (
                  <PaginationItem key={page}>
                    <Button
                      size="icon"
                      className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionDatatable;

/**
 * Description placeholder
 *
 * @returns {*}
 */
function RowActions(): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2"
            aria-label="Edit item"
          >
            <EllipsisVerticalIcon className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
