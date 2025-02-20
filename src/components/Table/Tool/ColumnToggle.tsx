"use client";

import { useEffect } from "react"; // Add useEffect
import { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { CustomColumnMeta } from "@/types/table";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  defaultVisibleColumns?: string[]; // Add prop for default visibility
}

export function DataTableViewOptions<TData>({ table, defaultVisibleColumns }: DataTableViewOptionsProps<TData>) {
  useEffect(() => {
    if (defaultVisibleColumns) {
      table.getAllLeafColumns().forEach((column) => {
        const isVisibleByDefault = defaultVisibleColumns.includes(column.id);
        column.toggleVisibility(isVisibleByDefault);
      });
    }
  }, [table, defaultVisibleColumns]); // Run once on mount or when defaults change

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 ml-auto">
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuLabel>Columns Toggle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table.getAllLeafColumns().map((column) => {
          const meta = column.columnDef.meta as CustomColumnMeta<TData, unknown> | undefined;
          const title = meta?.title || column.id;
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {title}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}