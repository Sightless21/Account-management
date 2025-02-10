"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DayoffType, UserRole } from "@/types/day-off"
import { TrashIcon, PencilIcon, CheckCircle, XCircle } from "lucide-react"

type ActionButtonsProps = {
  row: Row<DayoffType>
  onEdit?: (data: DayoffType) => void
  onDelete?: (data: DayoffType) => void
}

const ActionButtons = ({ row, onEdit, onDelete }: ActionButtonsProps) => (
  <div className="flex gap-2">
    {onEdit && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(row.original)}
        className="h-8 w-8"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(row.original)}
        className="h-8 w-8 text-red-500"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    )}
  </div>
)

type ApprovalButtonsProps = {
  row: Row<DayoffType>
  onApprove?: (data: DayoffType) => void
  onReject?: (data: DayoffType) => void
}

const ApprovalButtons = ({ row, onApprove, onReject }: ApprovalButtonsProps) => (
  <div className="flex gap-2">
    {onApprove && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onApprove(row.original)}
        className="h-8 w-8 text-green-500"
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    )}
    {onReject && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onReject(row.original)}
        className="h-8 w-8 text-red-500"
      >
        <XCircle className="h-4 w-4" />
      </Button>
    )}
  </div>
)

export const getColumns = (
  role: UserRole,
  handlers: {
    onEdit?: (data: DayoffType) => void
    onDelete?: (data: DayoffType) => void
    onApprove?: (data: DayoffType) => void
    onReject?: (data: DayoffType) => void
  }
): ColumnDef<DayoffType>[] => {
  const baseColumns: ColumnDef<DayoffType>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee Name",
    },
    {
      accessorKey: "leaveType",
      header: "Leave Type",
    },
    {
      accessorKey: "date",
      header: "Date (DD-MM-YYYY)",
      cell: ({ row }) => {
        const { from, to } = row.original.date || {}
        const fromDate = from ? new Date(from).toLocaleDateString() : "N/A"
        const toDate = to ? new Date(to).toLocaleDateString() : "N/A"
         return `${fromDate} - ${toDate}`
      },
    },
  ]

  const statusColumn: ColumnDef<DayoffType> = {
    accessorKey: "status",
    header: "Status",
  }

  const actionColumn: ColumnDef<DayoffType> = {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionButtons
        row={row}
        onEdit={handlers.onEdit}
        onDelete={handlers.onDelete}
      />
    ),
  }

  const approvalColumn: ColumnDef<DayoffType> = {
    id: "approval",
    header: "Approve/Reject",
    cell: ({ row }) => (
      <ApprovalButtons
        row={row}
        onApprove={handlers.onApprove}
        onReject={handlers.onReject}
      />
    ),
  }

  switch (role) {
    case "EMPLOYEE":
      return [...baseColumns, statusColumn, actionColumn]
    case "HR":
      return [...baseColumns, statusColumn, actionColumn, approvalColumn]
    case "MANAGER":
      return [...baseColumns, approvalColumn]
    case "ADMIN":
      return [...baseColumns, approvalColumn, actionColumn, approvalColumn]
    default:
      return baseColumns
  }
}