"use client";
import CarReservationTable from "@/components/Table/CarReservation-table/CarReservationTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";


export default function CarReservation() {

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Car Reservation</CardTitle>
          <CardDescription>Car Reservation and tracking system.</CardDescription>
        </CardHeader>
        <CardContent>
          <CarReservationTable userRole={"HR"} />
        </CardContent>
      </Card>
    </div>
  );
}
