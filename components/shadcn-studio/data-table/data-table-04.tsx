"use client";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useId, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // Module augmentation requires unused generic parameter
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "range" | "select" | "text";
  }
}

/**
 * Description placeholder
 *
 * @typedef {Item}
 */
interface Item {
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
  product: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  productImage: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  fallback: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  price: number;
  /**
   * Description placeholder
   *
   * @type {("In Stock" | "Limited" | "Out of Stock")}
   */
  availability: "In Stock" | "Limited" | "Out of Stock";
  /**
   * Description placeholder
   *
   * @type {number}
   */
  rating: number;
}

/**
 * Description placeholder
 *
 * @type {ColumnDef<Item>[]}
 */
const columns: ColumnDef<Item>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    id: "select",
  },
  {
    accessorKey: "product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="rounded-sm">
          <AvatarImage
            src={row.original.productImage}
            alt={row.original.fallback}
          />
          <AvatarFallback className="text-xs">
            {row.original.fallback}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium">{row.getValue("product")}</div>
      </div>
    ),
    header: "Product",
  },
  {
    accessorKey: "price",
    cell: ({ row }) => <div>${row.getValue("price")}</div>,
    enableSorting: false,
    header: "Price",
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "availability",
    cell: ({ row }) => {
      const availability = row.getValue("availability") as string;

      const styles = {
        "In Stock":
          "bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5",
        Limited:
          "bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5",
        "Out of Stock":
          "bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive",
      }[availability];

      return (
        <Badge
          className={(cn("border-none focus-visible:outline-none"), styles)}
        >
          {row.getValue("availability")}
        </Badge>
      );
    },
    enableSorting: false,
    header: "Availability",
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "rating",
    cell: ({ row }) => <div>{row.getValue("rating")}</div>,
    header: "Rating",
    meta: {
      filterVariant: "range",
    },
  },
];

/**
 * Description placeholder
 *
 * @type {Item[]}
 */
const items: Item[] = [
  {
    availability: "In Stock",
    fallback: "BC",
    id: "1",
    price: 159,
    product: "Black Chair",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-1.png",
    rating: 3.9,
  },
  {
    availability: "Limited",
    fallback: "NJ",
    id: "2",
    price: 599,
    product: "Nike Jordan",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-2.png",
    rating: 4.4,
  },
  {
    availability: "Out of Stock",
    fallback: "O7P",
    id: "3",
    price: 1299,
    product: "OnePlus 7 Pro",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-3.png",
    rating: 3.5,
  },
  {
    availability: "In Stock",
    fallback: "NS",
    id: "4",
    price: 499,
    product: "Nintendo Switch",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-4.png",
    rating: 4.9,
  },
  {
    availability: "Limited",
    fallback: "AMM",
    id: "5",
    price: 970,
    product: "Apple magic mouse",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-5.png",
    rating: 4.1,
  },
  {
    availability: "Limited",
    fallback: "AW",
    id: "6",
    price: 1500,
    product: "Apple watch",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-6.png",
    rating: 3.1,
  },
  {
    availability: "Out of Stock",
    fallback: "CGS",
    id: "7",
    price: 194,
    product: "Casio G-Shock",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-8.png",
    rating: 1.5,
  },
  {
    availability: "Out of Stock",
    fallback: "RBS",
    id: "8",
    price: 199,
    product: "RayBan Sunglasses",
    productImage:
      "https://cdn.shadcnstudio.com/ss-assets/products/product-10.png",
    rating: 2.4,
  },
];

/**
 * Description placeholder
 *
 * @returns {*}
 */

const DataTableWithColumnFilterDemo = (): JSX.Element => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: false,
      id: "price",
    },
  ]);

  const table = useReactTable({
    columns,
    data: items,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="flex flex-wrap gap-3 px-2 py-6">
          <div className="w-44">
            <Filter
              column={table.getColumn("product") as Column<unknown, unknown>}
            />
          </div>
          <div className="w-36">
            <Filter
              column={table.getColumn("price") as Column<unknown, unknown>}
            />
          </div>
          <div className="w-44">
            <Filter
              column={
                table.getColumn("availability") as Column<unknown, unknown>
              }
            />
          </div>
          <div className="w-36">
            <Filter
              column={table.getColumn("rating") as Column<unknown, unknown>}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="relative h-10 border-t select-none"
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
                    <TableCell key={cell.id}>
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

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Data table with column filter
      </p>
    </div>
  );
};

/**
 * Description placeholder
 *
 * @param {{ column: Column<any, unknown> }} param0
 * @param {Column<any, unknown>} param0.column
 * @returns {*}
 */
function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : "";

  const sortedUniqueValues =
    filterVariant === "range"
      ? []
      : Array.from(
          new Set(
            Array.from(column.getFacetedUniqueValues().keys()).reduce(
              (acc: string[], curr) =>
                Array.isArray(curr) ? [...acc, ...curr] : [...acc, curr],
              [],
            ),
          ),
        ).sort();

  if (filterVariant === "range") {
    return (
      <div className="*:not-first:mt-2">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === "select") {
    return (
      <div className="*:not-first:mt-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? "all"}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger id={`${id}-select`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}

export default DataTableWithColumnFilterDemo;
