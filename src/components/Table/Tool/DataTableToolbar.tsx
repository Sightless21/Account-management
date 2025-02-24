// src/components/Table/Tool/DataTableToolbar.tsx
"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/Table/Tool/ColumnToggle";
import { StatusFilter } from "@/components/Table/Tool/StatusFilter";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "@/components/Table/Tool/DateRangeFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  dateColumn?: string;
  statusColumn?: string;
  statusOptions?: { label: string; value: string }[];
  enableReset?: boolean;
  enableColumnVisibility?: boolean;
  additionalControls?: React.ReactNode;
  redirect?: React.ReactNode; // คง prop redirect ไว้
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Search...",
  dateColumn,
  statusColumn,
  statusOptions,
  enableReset = true,
  enableColumnVisibility = true,
  additionalControls,
  redirect,
}: DataTableToolbarProps<TData>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const onDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from) {
      table.getColumn(dateColumn!)?.setFilterValue(dateRange);
    } else {
      table.getColumn(dateColumn!)?.setFilterValue(undefined);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {searchColumn && (
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
          className="max-w-sm w-[250px] h-8"
        />
      )}
      {dateColumn && <DateRangeFilter date={date} setDate={setDate} onDateRangeChange={onDateRangeChange} />}
      {statusColumn && statusOptions && (
        <StatusFilter column={table.getColumn(statusColumn)} title="Status" options={statusOptions} />
      )}
      {enableReset && (
        <Button
          className="h-8"
          onClick={() => {
            table.resetColumnFilters();
            table.resetColumnVisibility();
            table.resetSorting();
            setDate({ from: undefined, to: undefined });
          }}
        >
          Reset
        </Button>
      )}
      {additionalControls}
      {enableColumnVisibility && <DataTableViewOptions table={table} />}
      {redirect} {/* แสดง redirect ใน div เดียวกัน */}
    </div>
  );
}