import { format } from "date-fns"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Booking } from "@/types/booking"

interface BookingTableProps {
  bookings: Booking[]
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
  selectedDate?: Date
}

export function BookingTable({ bookings, onEdit, onDelete, selectedDate }: BookingTableProps) {
  const filteredBookings = bookings.filter((booking) => {
    if (!selectedDate) return true
    return booking.date.toDateString() === selectedDate.toDateString()
  })

  return (
    <div className="border rounded">
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0 bg-white z-20">
            <TableHead>Meeting room username</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id} className="max-h-[600px] overflow-y-auto">
              <TableCell>{booking.username}</TableCell>
              <TableCell>{format(booking.date, "yyyy-MM-dd")}</TableCell>
              <TableCell>
                {booking.startTime} - {booking.endTime}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => onEdit(booking)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDelete(booking.id)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}