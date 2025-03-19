/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from "react"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  isNumeric?: boolean
  isDate?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  isNumeric = false,
  isDate = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  // ฟังก์ชันกำหนดข้อความในเมนูและทิศทางการเรียง
  const getSortOptions = (): { label: string; direction: boolean; icon: React.ComponentType }[] => {
    if (isDate) {
      return [
        { label: "Oldest to Newest", direction: true, icon: ArrowUp }, // Ascending
        { label: "Newest to Oldest", direction: false, icon: ArrowDown }, // Descending
      ]
    }
    if (isNumeric) {
      return [
        { label: "Low to High", direction: true, icon: ArrowUp }, // Ascending
        { label: "High to Low", direction: false, icon: ArrowDown }, // Descending
      ]
    }
    return [
      { label: "A-Z", direction: true, icon: ArrowUp },
      { label: "Z-A", direction: false, icon: ArrowDown },
    ]
  }

  const sortOptions = getSortOptions()

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuPortal>Toggle Columns</DropdownMenuPortal>
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={() => column.toggleSorting(option.direction)}
            >
              {React.createElement(option.icon, { className: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" } as any)}
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.clearSorting()}
            className="text-destructive bg-red-100"
          >
            <X className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 text-red-600" />
            Clear Sort
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(false)}
            className="bg-gray-100"
          >
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 text-slate-600" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}