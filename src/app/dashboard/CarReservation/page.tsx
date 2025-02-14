"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import CarReservationTable from "@/components/Table/CarReservation-table/CarReservationTable"

//TODO : สร้างหน้า CarReservation
export default function CarReservation() {

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Car Reservation</CardTitle>
          <CardDescription>Car Reservation and tracking system.</CardDescription>
        </CardHeader>
        <CardContent>
          <CarReservationTable />
        </CardContent>
      </Card>
    </div>
  );
}
