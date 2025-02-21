"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { CarReservationType, TripStatus } from "@/types/car-reservation";
import { CheckCircle, MoveRight, RotateCcw, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../ColumnHeader";
import { DateRange } from "react-day-picker";
import { ActionsCell } from "./MenuActionCell";
import { Role } from "@/types/users";
import { Button } from "@/components/ui/button";

// Define the trip status colors
const tripStatusColor: Record<TripStatus, string> = {
  ONGOING: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

type ApprovalButtonsProps = {
  row: Row<CarReservationType>
  onAccepted?: (data: CarReservationType) => void
  onDeclined?: (data: CarReservationType) => void
  onReset?: (data: CarReservationType) => void
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

export const getColumns = (role: Role,
  handlers: {
    onApprove?: (data: CarReservationType) => void
    onReject?: (data: CarReservationType) => void
    onReset?: (data: CarReservationType) => void
  }
): ColumnDef<CarReservationType>[] => {
  const baseColumns: ColumnDef<CarReservationType>[] = [
    {
      id: "employeeName",
      accessorKey: "employeeName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Name" />,
      meta: { title: "Employee Name" },
    },
    {
      id: "date",
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      filterFn: (row, columnId, filterValue: DateRange | undefined) => {
        const rowDate = row.getValue(columnId) as { from?: string | Date; to?: string | Date };
        const filterFrom = filterValue?.from;
        const filterTo = filterValue?.to;

        if (!filterFrom && !filterTo) return true;

        const rowStart = rowDate.from ? new Date(rowDate.from).getTime() : 0;
        const rowEnd = rowDate.to ? new Date(rowDate.to).getTime() : Infinity;
        const filterStart = filterFrom?.getTime() || 0;
        const filterEnd = filterTo?.getTime() || Infinity;

        return rowStart <= filterEnd && rowEnd >= filterStart;
      },
      cell: ({ row }) => {
        const { from, to } = row.original.date || {};
        const fromDate = from ? format(from, "dd-MM-yyyy") : "N/A";
        const toDate = to ? format(to, "dd-MM-yyyy") : "N/A";
        if (fromDate === toDate) {
          return (
            <div className="flex items-center space-x-1">
              <span>{fromDate}</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-1">
              <span>{fromDate}</span>
              <MoveRight />
              <span>{toDate}</span>
            </div>
          );
        }
      },
    },
    {
      id: "time",
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const { startTime, endTime } = row.original;
        return (
          <div className="flex items-center space-x-1">
            <span>{startTime}</span>
            <MoveRight />
            <span>{endTime}</span>
          </div>
        );
      },
    },
    {
      id: "destination",
      accessorKey: "destination",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Destination" />,
    },
    {
      id: "plateNumber",
      accessorKey: "Plate Number",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plate Number" />,
      cell: ({ row }) => {
        const { car } = row.original;
        return (
          <div className="flex items-center space-x-1">
            <span>{car.plate}</span>
          </div>
        );
      },
    },
    {
      id: "tripStatus",
      accessorKey: "tripStatus",
      header: "Status",
      filterFn: (row, id, value: string[]) => {
        if (!value?.length) return true;
        const status = row.getValue(id) as string;
        return value.includes(status);
      },
      cell: ({ row }) => {
        const { tripStatus } = row.original;
        return <Badge className={tripStatusColor[tripStatus] || "bg-gray-500"}>{tripStatus}</Badge>;
      },
      meta: { title: "Trip Status" },
    },
  ];

  const actionsColumn: ColumnDef<CarReservationType> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  }

  const approvalColumn: ColumnDef<CarReservationType> = {
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
      return [...baseColumns, actionsColumn]
    case "HR":
      return [...baseColumns, approvalColumn, actionsColumn]
    case "MANAGER":
      return [...baseColumns, approvalColumn, actionsColumn]
    case "ADMIN":
      return [...baseColumns, approvalColumn, actionsColumn]
    default:
      return baseColumns
  }

}
