'use client'
import { columns } from "./columns"
import { DataTable } from "@/components/Table/Data-Table"
import React from "react"
import { useCarReservation } from "@/hooks/useCarReservationData"
import { CarReservationDrawer } from "@/components/Drawer/drawer-CarReservation"


//TODO : Feature filter data
export default function CarReservationTable() {

  const { data: carReservations, isLoading, error } = useCarReservation()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={carReservations || []}
        searchColumn="employeeName"
        searchPlaceholder="Search employee name..."
        dateColumn="date"
        statusColumn="tripStatus"
        statusOptions={[
          { value: "ONGOING", label: "Ongoing" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
        toolbarAdditionalControls={<CarReservationDrawer />}
      />
    </div>
  )
}
