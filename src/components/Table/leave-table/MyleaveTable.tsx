"use client"

import { useEffect, useState } from "react"
import { DayOff, getColumns, UserRole } from "./columns"
import { DataTable } from "./data-table"

interface DemoTableProps {
  userRole: UserRole
}

async function getData(): Promise<DayOff[]> {
  return [
    {
      id: "728ed52f",
      employeeName: "John Doe",
      leaveType: "Sick",
      date: {
        from: new Date("2023-06-01"),
        to: new Date("2023-06-05"),
      },
      status: "Pending",
    },
    // Add more sample data as needed
  ]
}

export default function DemoTable({ userRole }: DemoTableProps) {
  const [data, setData] = useState<DayOff[]>([])

  useEffect(() => {
    getData().then(setData)
  }, [])

  const handleEdit = (dayOff: DayOff) => {
    console.log("Edit day off:", dayOff)
    // Implement edit functionality
  }

  const handleDelete = (dayOff: DayOff) => {
    console.log("Delete day off:", dayOff)
    // Implement delete functionality
  }

  const handleApprove = (dayOff: DayOff) => {
    console.log("Approve day off:", dayOff)
    // Implement approve functionality
  }

  const handleReject = (dayOff: DayOff) => {
    console.log("Reject day off:", dayOff)
    // Implement reject functionality
  }

  const columns = getColumns(userRole, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onApprove: handleApprove,
    onReject: handleReject,
  })

  return <DataTable columns={columns} data={data} />
}