"use client"

import type { ColumnDef, Row } from "@tanstack/react-table"
import type { RoombookingType } from "@/types/room-bookings"
import { Button } from "@/components/ui/button"
import { BookingDialog } from "@/components/Modal/modal-Booking"
import { useDeleteRoomBooking } from "@/hooks/useRoomBookingData"
import { MoveRight, TrashIcon, ArrowUpDown } from "lucide-react"

type ActionButtonsProps = {
  row: Row<RoombookingType>
  onEdit?: (data: RoombookingType) => void
  onDelete?: (data: RoombookingType) => void
}

const ActionButtons = ({ row, onEdit, onDelete }: ActionButtonsProps) => {
  const { mutate: deleteRoomBooking } = useDeleteRoomBooking()

  return (
    <div className="flex gap-2">
      {onEdit && (
        <BookingDialog
          mode="edit"
          defaultvalue={row.original}
        />
      )}
      {onDelete && (
        <Button
          variant={"outline"}
          size="icon"
          onClick={() => deleteRoomBooking(row.original.id)}
          className="h-8 w-8 text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

const handleEdit = (data: RoombookingType) => {
  console.log("Edit", data)
}

export const columns: ColumnDef<RoombookingType>[] = [
  {
    accessorKey: "username",
    header: "Meeting room username",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rawDate = row.original.date;
      if (!rawDate) return "N/A";

      const date = new Date(rawDate);
      return `${date.toISOString().split("T")[0]}`;
    },
    sortingFn: "datetime"
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const { startTime, endTime } = row.original
      return (
        <div className="flex items-center space-x-1">
          <span>{startTime}</span>
          <MoveRight />
          <span>{endTime}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionButtons
        row={row}
        onEdit={(data) => handleEdit(data)}
        onDelete={(data) => console.log("Delete", data)}
      />
    ),
  },
]