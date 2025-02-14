"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { CarReservationType, TripStatus } from "@/types/car-reservation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoveRight, TrashIcon, MoreHorizontal, Info, Copy, Pencil } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const tripStatusColor: Record<TripStatus, string> = {
  ONGOING: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ActionButtonsProps = {
  row: Row<CarReservationType>
  onEdit?: (data: CarReservationType) => void
  onDelete?: (data: CarReservationType) => void
}

export const columns: ColumnDef<CarReservationType>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee Name",
  },
  {
    accessorKey: "date",
    header: "Date Range",
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
            < MoveRight />
            <span>{toDate}</span>
          </div>
        );
      }
    },
  },
  {
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
    }
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "plate",
    header: "Plate",
    cell: ({ row }) => {
      const { car } = row.original;
      return (
        <div className="flex items-center space-x-1">
          <span>{car.plate}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "tripStatus",
    header: "Status",
    cell: ({ row }) => {
      const { tripStatus } = row.original;
      return <Badge className={tripStatusColor[tripStatus] || "bg-gray-500"}>{tripStatus}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { employeeName } = row.original

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

              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employeeName)}>
                <Copy /> Copy Employee Name
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => { }}>
                <Info /> View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { }}>
                <Pencil /> Edit Reservation
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => { }} className="text-red-600">
                <TrashIcon /> Delete Reservation
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider >
      )
    },
  },
]
