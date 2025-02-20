"use client"
import { BookingDialog } from "@/components/Modal/modal-Booking"
import { columns } from "./columns"
import { DataTable } from "@/components/Table/Data-Table"
import { useRoomBookings } from "@/hooks/useRoomBookingData"


export default function BookingRoomTable() {
  const { data: roombookings, isLoading, error } = useRoomBookings()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>


  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={roombookings || []}
        searchColumn="username"
        searchPlaceholder="Search username..."
        dateColumn="date"
        defaultVisibleColumns={["username", "time", "date", "actions"]}
        toolbarAdditionalControls={<BookingDialog />}
      />
    </div>
  )
}

