"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DayoffType, UserRole, LeaveStatus } from "@/types/day-off"
import { TrashIcon, CheckCircle, XCircle, RotateCcw, MoveRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DayoffModal } from "@/components/Modal/modal-DayOff"
import { format } from "date-fns"

const statusColor: Record<LeaveStatus, string> = {
  Pending: "bg-yellow-500 text-white",
  Accepted: "bg-green-500 text-white",
  Declined: "bg-red-500 text-white",
};

type ActionButtonsProps = {
  row: Row<DayoffType>
  onEdit?: (data: DayoffType) => void
  onDelete?: (data: DayoffType) => void
}

const ActionButtons = ({ row, onEdit, onDelete }: ActionButtonsProps) => (
  <div className="flex gap-2">
    {onEdit && (
      <DayoffModal
        mode="edit"
        defaultValue={row.original}
      />
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
  onAccepted?: (data: DayoffType) => void
  onDeclined?: (data: DayoffType) => void
  onReset?: (data: DayoffType) => void
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

export const getColumns = (
  role: UserRole,
  handlers: {
    onEdit?: (data: DayoffType) => void
    onDelete?: (data: DayoffType) => void
    onApprove?: (data: DayoffType) => void
    onReject?: (data: DayoffType) => void
    onReset?: (data: DayoffType) => void
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
      header: "Date Range",
      cell: ({ row }) => {
        const { from, to } = row.original.date || {}
        const fromDate = from ? format(from, "dd-MM-yyyy") : "N/A"
        const toDate = to ? format(to, "dd-MM-yyyy") : "N/A"
        if (from === to) {
          return (
            <div className="flex items-center space-x-1">
              <span>{fromDate}</span>
            </div>
          )
        }
        return (
          <div className="flex items-center space-x-1">
            <span>{fromDate}</span>
            < MoveRight/>
            <span>{toDate}</span>
          </div>
        )
      },
    },
  ]

  const statusColumn: ColumnDef<DayoffType> = {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge className={statusColor[status] || "bg-gray-500"}>{status}</Badge>;
    },
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

  switch (role) {
    case "EMPLOYEE":
      return [...baseColumns, statusColumn, actionColumn]
    case "HR":
      return [...baseColumns, approvalColumn, statusColumn, actionColumn, ]
    case "MANAGER":
      return [...baseColumns, approvalColumn, statusColumn]
    case "ADMIN":
      return [...baseColumns, approvalColumn, statusColumn, actionColumn]
    default:
      return baseColumns
  }
}