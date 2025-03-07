import { ColumnDef, Row } from "@tanstack/react-table";
import { Expense } from "@/schema/expenseFormSchema"
import { DataTableColumnHeader } from "../ColumnHeader"; // Adjust path
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw, XCircle } from "lucide-react";
import { MenuActionsCell } from "./MenuActionsCell"; // Assuming this is extracted

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
  role: string,
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
      id: "Title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      meta: { title: "Title" },
    },
    {
      id: "employeeName",
      accessorKey: "employeeName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Name" />,
      meta: { title: "Employee Name" },
    },
    {
      id: "Total",
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
        return totalCost * rate;
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
      meta: { title: "Total" },
    },
    {
      id: "transactionDate",
      accessorKey: "transactionDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
      cell: ({ row }) => {
        const date = new Date(row.original.transactionDate);
        return isNaN(date.getTime()) ? "Invalid Date" : format(date, "PPP");
      },
      enableSorting: true,
      sortingFn: "datetime",
      filterFn: (row, columnId, filterValue: DateRange | undefined) => {
        if (!filterValue || (!filterValue.from && !filterValue.to)) return true;
        const rowDate = new Date(row.getValue(columnId) as string).getTime();
        const start = filterValue.from ? new Date(filterValue.from).getTime() : -Infinity;
        const end = filterValue.to ? new Date(filterValue.to).getTime() : Infinity;
        return rowDate >= start && rowDate <= end;
      },
      meta: { title: "Transaction Date" },
    },
  ];

  const statusColumn: ColumnDef<Expense> = {
    id: "status",
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
    meta: { title: "Status" },
  };

  const approvalColumn: ColumnDef<Expense> = {
    header: "Approval",
    cell: ({ row }) => (
      <ApprovalButtons
        row={row}
        onAccepted={handlers.onApprove}
        onDeclined={handlers.onReject}
        onReset={handlers.onReset}
      />
    ),
    meta: { title: "Approval" },
  };

  const menuActionColumn: ColumnDef<Expense> = {
    id: "menu-actions",
    cell: ({ row }) => (
      <MenuActionsCell
        row={row}
        onEdit={handlers.onEdit}
        onDelete={handlers.onDelete}
        onSetSelectedExpense={handlers.onSetSelectedExpense}
      />
    ),
    meta: { title: "Actions" },
  };

  const canApprove = ["MANAGER", "HR", "ADMIN"].includes(role.toUpperCase());
  return [
    ...baseColumns,
    ...(canApprove ? [approvalColumn] : []),
    statusColumn,
    menuActionColumn,
  ];
};