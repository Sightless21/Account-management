"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import BookingRoomTable from "@/components/Table/BookingRoom-table/BookingRoomTable"

export default function RoomBooking() {

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card className="p-2 h-full">
        <CardHeader>
          <CardTitle>Meeting Room Booking</CardTitle>
          <CardDescription>Manage your meeting room bookings and tracking system.</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="mx-auto space-y-4">
            <BookingRoomTable />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}