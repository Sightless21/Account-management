"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DayoffType, UserRole, LeaveStatus } from "@/types/day-off"
import { TrashIcon, CheckCircle, XCircle, RotateCcw, MoveRight, X, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DayoffModal } from "@/components/Modal/modal-DayOff"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { DataTableColumnHeader } from "../ColumnHeader"
import CustomAlertDialog from "@/components/ui/customAlertDialog"
import { useState } from "react"

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

const ActionButtons = ({ row, onEdit, onDelete }: ActionButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex gap-2">
      {onEdit && (
        <DayoffModal
          mode="edit"
          defaultValue={row.original}
        />
      )}
      {onDelete && (<>
        <Button
          variant={"outline"}
          size="icon"
          onClick={(e) => { e.preventDefault(); setIsOpen(true) }}
          className="h-8 w-8 text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
        <CustomAlertDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={() => onDelete(row.original)}
          title="Delete Dayoff"
          description="Are you sure you want to delete this dayoff?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmIcon={Trash2}
          cancelIcon={X}
        />
      </>
      )}
    </div>
  )
}

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
      id: "employeeName",
      accessorKey: "employeeName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee Name" />
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const employeeName = row.getValue(columnId) as string;
        const nameLower = employeeName.toLowerCase();
        const filterLower = filterValue.toLowerCase();
        return nameLower.includes(filterLower);
      },
      meta: { title: "Employee Name" },
    },
    {
      id: "leaveType",
      accessorKey: "leaveType",
      header: "Leave Type",
      meta: { title: "Leave Type" },
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Date Range",
      filterFn: (row, columnId, filterValue: DateRange | undefined) => {
        if (!filterValue?.from) return true;

        const rowDate = row.original.date;
        if (!rowDate?.from) return false;

        const rowStart = new Date(rowDate.from);
        const rowEnd = new Date(rowDate.to || rowDate.from);
        const filterStart = new Date(filterValue.from);
        const filterEnd = filterValue.to ? new Date(filterValue.to) : filterStart;

        // Reset time parts for accurate date comparison
        rowStart.setHours(0, 0, 0, 0);
        rowEnd.setHours(0, 0, 0, 0);
        filterStart.setHours(0, 0, 0, 0);
        filterEnd.setHours(0, 0, 0, 0);

        // Check if date ranges overlap
        return rowStart <= filterEnd && rowEnd >= filterStart;
      },
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
            < MoveRight />
            <span>{toDate}</span>
          </div>
        )
      },
      meta: { title: "Date Range" },
    },
  ]

  const statusColumn: ColumnDef<DayoffType> = {
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
      return <Badge className={statusColor[status] || "bg-gray-500"}>{status}</Badge>;
    },
    meta: { title: "Status" },
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
    meta: { title: "Action" },
  }

  const approvalColumn: ColumnDef<DayoffType> = {
    id: "approval",
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
  }

  switch (role) {
    case "EMPLOYEE":
      return [...baseColumns, statusColumn, actionColumn]
    case "HR":
      return [...baseColumns, approvalColumn, statusColumn, actionColumn,]
    case "MANAGER":
      return [...baseColumns, approvalColumn, statusColumn, actionColumn]
    case "ADMIN":
      return [...baseColumns, approvalColumn, statusColumn, actionColumn]
    default:
      return baseColumns
  }
}