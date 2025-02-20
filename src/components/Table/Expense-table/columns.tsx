"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckCircle, Copy, Info, MoreHorizontal, Pencil, RotateCcw, TrashIcon, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm";
import { DataTableColumnHeader } from "../ColumnHeader";
import { Expense } from "@/types/expense";
import { format } from "date-fns"; // Add date-fns for formatting
import { DateRange } from "react-day-picker"; // Import DateRange type

export enum ExpenseStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Declined = "Declined",
}

const statusColor: Record<ExpenseStatus, string> = {
  [ExpenseStatus.Pending]: "bg-yellow-500 text-white",
  [ExpenseStatus.Accepted]: "bg-green-500 text-white",
  [ExpenseStatus.Declined]: "bg-red-500 text-white",
};

const exchangeRates: Record<string, number> = {
  JPY: 0.25, // 1 JPY = 0.25 THB
  THB: 1,    // 1 THB = 1 THB
};

type ApprovalButtonsProps = {
  row: Row<Expense>;
  onAccepted?: (data: Expense) => void;
  onDeclined?: (data: Expense) => void;
  onReset?: (data: Expense) => void;
};

const ApprovalButtons = ({ row, onAccepted, onDeclined, onReset }: ApprovalButtonsProps) => (
  <div className="flex gap-3">
    {onAccepted && (
      <Button
        variant="outline"
        size="icon"
        onClick={() => onAccepted(row.original)}
        className="h-8 w-8 text-green-500"
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    )}
    {onDeclined && (
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDeclined(row.original)}
        className="h-8 w-8 text-red-500"
      >
        <XCircle className="h-4 w-4" />
      </Button>
    )}
    {onReset && (
      <Button
        variant="outline"
        size="icon"
        onClick={() => onReset(row.original)}
        className="h-8 w-8 text-yellow-500"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    )}
  </div>
);

export const getColumns = (
  role: string, // Changed from Role enum to string
  handlers: {
    onEdit?: (data: Expense) => void;
    onDelete?: (data: Expense) => void;
    onApprove?: (data: Expense) => void;
    onReject?: (data: Expense) => void;
    onReset?: (data: Expense) => void;
    onSetSelectedExpense: (expense: Expense | null) => void;
  }
): ColumnDef<Expense>[] => {
  const baseColumns: ColumnDef<Expense>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    },
    {
      accessorKey: "employeeName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Name" />,
    },
    {
      id: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      accessorFn: (row) => {
        const { expenses, useForeignCurrency, country } = row;
        if (!expenses) return 0;

        const totalCost = Object.values(expenses).reduce((sum, expense) => {
          if (expense && "totalCost" in expense) return sum + (expense.totalCost || 0);
          if (expense && "amount" in expense) return sum + (expense.amount || 0);
          return sum;
        }, 0);

        const currency = useForeignCurrency && country ? country.toUpperCase() : "THB";
        const rate = exchangeRates[currency] || 1;
        return totalCost * rate; // Return numeric value for sorting
      },
      cell: ({ row }) => {
        const { expenses, useForeignCurrency, country } = row.original;
        if (!expenses) return "0 THB";

        const totalCost = Object.values(expenses).reduce((sum, expense) => {
          if (expense && "totalCost" in expense) return sum + (expense.totalCost || 0);
          if (expense && "amount" in expense) return sum + (expense.amount || 0);
          return sum;
        }, 0);

        const currency = useForeignCurrency && country ? country.toUpperCase() : "THB";
        const rate = exchangeRates[currency] || 1;
        const convertedTotal = totalCost * rate;

        return `${convertedTotal.toLocaleString()} THB`;
      },
      enableSorting: true,
    },
    {
      accessorKey: "transactionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
      cell: ({ row }) => {
        const date = new Date(row.original.transactionDate);
        return isNaN(date.getTime()) ? "Invalid Date" : format(date, "PPP"); // Format as "Jan 1, 2025"
      },
      enableSorting: true,
      sortingFn: "datetime", 
      filterFn: (row, columnId, filterValue: DateRange | undefined) => {
        if (!filterValue || (!filterValue.from && !filterValue.to)) return true; // No filter applied
      
        const rowDate = new Date(row.getValue(columnId) as string).getTime();
        const start = filterValue.from ? new Date(filterValue.from).getTime() : -Infinity;
        const end = filterValue.to ? new Date(filterValue.to).getTime() : Infinity;
      
        return rowDate >= start && rowDate <= end;
      },
    },
  ];

  const statusColumn: ColumnDef<Expense> = {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      const status = row.getValue(columnId) as string;
      return filterValue.includes(status);
    },
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge className={statusColor[status as ExpenseStatus] || "bg-gray-500"}>{status}</Badge>;
    },
  };

  const approvalColumn: ColumnDef<Expense> = {
    id: "approval",
    header: "Actions",
    cell: ({ row }) => (
      <ApprovalButtons
        row={row}
        onAccepted={handlers.onApprove}
        onDeclined={handlers.onReject}
        onReset={handlers.onReset}
      />
    ),
  };

  const menuActionColumn: ColumnDef<Expense> = {
    id: "menu-actions",
    cell: ({ row }) => {
      const { employeeName } = row.original;

      return (
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open actions menu</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => employeeName && navigator.clipboard.writeText(employeeName)}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Employee Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlers.onSetSelectedExpense(row.original)}>
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ExpenseClaimForm
                mode="edit"
                defaultValues={row.original}
                expenseId={row.original.id}
                onSubmitSuccess={() => handlers.onEdit?.(row.original)}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Expense
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handlers.onDelete?.(row.original)}
                className="text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" /> Delete Expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      );
    },
  };

  const canApprove = ["MANAGER", "HR", "ADMIN"].includes(role.toUpperCase());
  return [
    ...baseColumns,
    ...(canApprove ? [approvalColumn] : []),
    statusColumn,
    menuActionColumn,
  ];
};