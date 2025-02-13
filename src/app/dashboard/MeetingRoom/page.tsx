"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import BookingRoomTable from "@/components/Table/bookingRoom-table/BookingRoomTable"

//FIXME : Room Booking Page enchance ui or table
export default function RoomBooking() {

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card className="p-2 h-full">
        <CardHeader>
          <CardTitle>Meeting Room Booking</CardTitle>
          <CardDescription>Manage your room booking.</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="w-full mx-auto p-2 space-y-4">
            <BookingRoomTable />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



//NOTE
{/* <BookingDialog
      open={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      onSave={handleAddBooking}
      title="Add New Booking"
      description="Create a new room booking. Fill in all the required information."
    />

    <BookingDialog
      open={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      booking={selectedBooking}
      onSave={handleEditBooking}
      title="Edit Booking"
      description="Modify the booking details below."
      /> */}