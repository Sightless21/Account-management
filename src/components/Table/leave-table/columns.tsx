"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { TrashIcon, PencilIcon, CheckCircle, XCircle } from "lucide-react"

export type DayOff = {
  id: string
  employeeName: string
  leaveType: string
  date: {
    from: Date
    to: Date
  }
  status: "Pending" | "Accepted" | "Declined"
}

export type UserRole = "EMPLOYEE" | "HR" | "MANAGER" | "ADMIN"

type ActionButtonsProps = {
  row: Row<DayOff>
  onEdit?: (data: DayOff) => void
  onDelete?: (data: DayOff) => void
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
  row: Row<DayOff>
  onApprove?: (data: DayOff) => void
  onReject?: (data: DayOff) => void
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
    onEdit?: (data: DayOff) => void
    onDelete?: (data: DayOff) => void
    onApprove?: (data: DayOff) => void
    onReject?: (data: DayOff) => void
  }
): ColumnDef<DayOff>[] => {
  const baseColumns: ColumnDef<DayOff>[] = [
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
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.date
        return `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
      },
    },
  ]

  const statusColumn: ColumnDef<DayOff> = {
    accessorKey: "status",
    header: "Status",
  }

  const actionColumn: ColumnDef<DayOff> = {
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

  const approvalColumn: ColumnDef<DayOff> = {
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