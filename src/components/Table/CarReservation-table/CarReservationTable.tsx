'use client'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import React, { useState } from "react"
import { CarReservationType } from "@/types/car-reservation"

export default function CarReservationTable() {

  const [data] = useState<CarReservationType[]>([
    {
      id: "728ed52f",
      userId: "some-user-id", // Add this line
      employeeName: "John Doe",
      date: {
        from: new Date(2025, 1, 12),
        to: new Date(2025, 1, 13),
      },
      destination: "New York",
      startTime: "09:00",
      endTime: "12:00",
      tripStatus: "ONGOING",
      carId: "728ed52f",
      car: {
        id: "728ed52f",
        name: "Honda Odyssey",
        plate: "ABC123",
        type: "SUV",
      }
    },
    {
      id: "728e3fea2",
      userId: "something-user-id",
      employeeName: "Jane Doe",
      date: {
        from: new Date(2025, 1, 15),
        to: new Date(2025, 1, 15),
      },
      destination: "Los Angeles",
      startTime: "10:00",
      endTime: "14:00",
      tripStatus: "COMPLETED",
      carId: "728ed52f",
      car: {
        id: "728ed52f",
        name: "Toyota Corolla",
        plate: "DEF456",
        type: "SEDAN",
      }
    }
  ])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
