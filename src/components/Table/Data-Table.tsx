// src/components/Table/Data-Table.tsx
"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "@/components/Table/Tool/DataTableToolbar";
import { TablePagination } from "@/components/Table/Tool/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  dateColumn?: string;
  statusColumn?: string;
  statusOptions?: { label: string; value: string }[];
  enableToolbar?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  toolbarAdditionalControls?: React.ReactNode;
  defaultVisibleColumns?: string[];
  redirect?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  dateColumn,
  statusColumn,
  statusOptions,
  enableToolbar = true,
  enablePagination = true,
  pageSize = 7,
  toolbarAdditionalControls,
  defaultVisibleColumns,
  redirect,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultVisibleColumns
      ? columns.reduce((acc, column) => {
          acc[column.id as string] = defaultVisibleColumns.includes(column.id as string);
          return acc;
        }, {} as VisibilityState)
      : {}
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    autoResetPageIndex: false,
  });

  return (
    <div className="space-y-4">
      {enableToolbar && (
        <DataTableToolbar
          table={table}
          searchColumn={searchColumn}
          searchPlaceholder={searchPlaceholder}
          dateColumn={dateColumn}
          statusColumn={statusColumn}
          statusOptions={statusOptions}
          additionalControls={toolbarAdditionalControls}
          redirect={redirect} // ส่ง redirect prop ไปยัง DataTableToolbar
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && <TablePagination table={table} />}
    </div>
  );
}