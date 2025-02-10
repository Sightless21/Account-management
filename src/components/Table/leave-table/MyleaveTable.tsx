"use client"

import { getColumns } from "./columns"
import { UserRole, DayoffType } from "@/types/day-off"
import { DataTable } from "./data-table"
import { useDayOff } from "@/hooks/useDayOffData"

interface DemoTableProps {
  userRole: UserRole
}

export default function DemoTable({ userRole }: DemoTableProps) {
  const { data: dayOffData, isLoading, error } = useDayOff();

  if (isLoading) return <p>Loading...</p>;
  
  if (error) return <p>Error loading data</p>;


  const handleEdit = (dayOff: DayoffType) => {
    console.log("Edit day off:", dayOff)
    // Implement edit functionality
  }

  const handleDelete = (dayOff: DayoffType) => {
    console.log("Delete day off:", dayOff)
    // Implement delete functionality
  }

  const handleApprove = (dayOff: DayoffType) => {
    console.log("Approve day off:", dayOff)
    // Implement approve functionality
  }

  const handleReject = (dayOff: DayoffType) => {
    console.log("Reject day off:", dayOff)
    // Implement reject functionality
  }

  const columns = getColumns(userRole, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onApprove: handleApprove,
    onReject: handleReject,
  })

  return <DataTable columns={columns} data={dayOffData ?? []} />
}