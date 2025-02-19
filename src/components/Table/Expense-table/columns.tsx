"use client"

import { Button } from "@/components/ui/button";
import { ExpenseFormValues } from "@/schema/expenseFormSchema"
import { ColumnDef, Row } from "@tanstack/react-table"
import { CheckCircle, Copy, Info, MoreHorizontal, Pencil, RotateCcw, TrashIcon, XCircle } from "lucide-react";
import { Role } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useExpenseStore } from '@/store/useExpenenseUIStore'
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm";
import { DataTableColumnHeader } from "../ColumnHeader";


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


type ApprovalButtonsProps = {
  row: Row<ExpenseFormValues>
  onAccepted?: (data: ExpenseFormValues) => void
  onDeclined?: (data: ExpenseFormValues) => void
  onReset?: (data: ExpenseFormValues) => void
}

const ApprovalButtons = ({ row, onAccepted, onDeclined, onReset }: ApprovalButtonsProps) => (
  <div className="flex gap-3">
    {onAccepted && (
      <Button
        variant={"outline"}
        size="icon"
        onClick={() => onAccepted(row.original)}
        className="h-8 w-8 text-green-500"
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    )}
    {onDeclined && (
      <Button
        variant={"outline"}
        size="icon"
        onClick={() => onDeclined(row.original)}
        className="h-8 w-8 text-red-500"
      >
        <XCircle className="h-4 w-4" />
      </Button>
    )}
    {onReset && (
      <Button
        variant={"outline"}
        size="icon"
        onClick={() => onReset(row.original)}
        className="h-8 w-8 text-yellow-500"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    )}
  </div>
)

const exchangeRates = {
  JPY: 0.25, // 1 JPY = 0.25 THB (ตัวอย่างอัตราแลกเปลี่ยน)
  THB: 1,     // 1 THB = 1 THB
};

// Helper function เพื่อเช็คว่า object มี totalCost
const hasTotalCost = (expense: unknown): expense is { totalCost: number } =>
  typeof (expense as { totalCost?: number }).totalCost === "number";

// Helper function เพื่อเช็คว่า object มี amount
const hasAmount = (expense: unknown): expense is { amount: number } =>
  typeof (expense as { amount?: number }).amount === "number";

export const getColumns = (
  role: Role,
  handlers: {
    onEdit?: (data: ExpenseFormValues) => void
    onDelete?: (data: ExpenseFormValues) => void
    onApprove?: (data: ExpenseFormValues) => void
    onReject?: (data: ExpenseFormValues) => void
    onReset?: (data: ExpenseFormValues) => void
  }
): ColumnDef<ExpenseFormValues>[] => {
  const baseColumns: ColumnDef<ExpenseFormValues>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: "employeeName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee Name" />
      ),
    },
    {
      accessorKey: "useForeignCurrency",
      header: "Total",
      cell: ({ row }) => {
        const { expenses, useForeignCurrency, country } = row.original;

        if (!expenses) return "0 THB"; // ถ้าไม่มีข้อมูลให้คืนค่า 0 THB

        const totalCost = Object.values(expenses).reduce((sum, expense) => {
          if (hasTotalCost(expense)) {
            return sum + expense.totalCost;
          } else if (hasAmount(expense)) {
            return sum + expense.amount;
          }
          return sum;
        }, 0);

        // แปลงค่าเงินถ้าจ่ายเป็นเงินต่างประเทศ
        const currency = useForeignCurrency ? (country === "japan" ? "JPY" : "THB") : "THB";
        const convertedTotal = totalCost * (exchangeRates[currency] || 1);

        return `${convertedTotal.toLocaleString()} THB`;
      }
    },
  ]

  const statusColumn: ColumnDef<ExpenseFormValues> = {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge className={statusColor[status] || "bg-gray-500"}>{status}</Badge>;
    },
  }

  const approvalColumn: ColumnDef<ExpenseFormValues> = {
    id: "approval",
    header: "Accepted/Declined",
    cell: ({ row }) => (
      <ApprovalButtons
        row={row}
        onAccepted={handlers.onApprove}
        onDeclined={handlers.onReject}
        onReset={handlers.onReset}
      />
    ),
  }

  const menuActionColumn: ColumnDef<ExpenseFormValues> = {
    id: "menu-actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const setSelectedExpense = useExpenseStore(state => state.setSelectedExpense)
      const { employeeName } = row.original;

      return (
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="h-8 w-8 p-0">
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

              <DropdownMenuItem onClick={() => {
                if (employeeName) {
                  navigator.clipboard.writeText(employeeName);
                }
              }}>
                <Copy /> Copy Employee Name
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setSelectedExpense(row.original)}>
                <Info /> View Details
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

              <DropdownMenuItem onClick={() => handlers.onDelete?.(row.original)} className="text-red-600">
                <TrashIcon /> Delete Reservation
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      );
    },
  };



  switch (role) {
    case "EMPLOYEE":
      return [...baseColumns, statusColumn, menuActionColumn]
    case "MANAGER":
      return [...baseColumns, approvalColumn, statusColumn, menuActionColumn]
    case "HR":
      return [...baseColumns, approvalColumn, statusColumn, menuActionColumn]
    case "ADMIN":
      return [...baseColumns, approvalColumn, statusColumn, menuActionColumn]
    default:
      return baseColumns
  }
}
