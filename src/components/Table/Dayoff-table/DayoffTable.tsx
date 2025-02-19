"use client"

import { getColumns } from "@/components/Table/Dayoff-table/columns"
import type { UserRole, DayoffType } from "@/types/day-off"
import { DataTable } from "@/components/Table/Data-Table"
import { useDayOff, useDeleteDayOff, useUpdateDayOff, useUpdateStatusDayOff } from "@/hooks/useDayOffData"

interface DayOffTableProps {
  userRole: UserRole
}

export default function DayOffTable({ userRole }: DayOffTableProps) {
  const { data: dayOffData, isLoading, error } = useDayOff()
  const { mutate: deleteDayOff } = useDeleteDayOff()
  const { mutate: updateDayOff } = useUpdateDayOff()
  const { mutate: updateStatusDayOff } = useUpdateStatusDayOff()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  const handleEdit = (dayOff: DayoffType) => {
    console.log("Edit day off:", dayOff)
    updateDayOff({ id: dayOff.id, newData: dayOff })
  }

  const handleDelete = (dayOff: DayoffType) => {
    console.log("Delete day off:", dayOff)
    deleteDayOff(dayOff.id)
  }

  const handleAccepted = (dayOff: DayoffType) => {
    console.log("✅ Approve day off (before update):", dayOff);
    updateStatusDayOff({ id: dayOff.id, status: "Accepted" });
  }

  const handleDeclined = (dayOff: DayoffType) => {
    console.log("❌ Reject day off:", dayOff);
    updateStatusDayOff({ id: dayOff.id, status: "Declined" });
  }

  const handleReset = (dayOff: DayoffType) => {
    console.log("Reset day off:", dayOff);
    updateStatusDayOff({ id: dayOff.id, status: "Pending" });
  }

  const columns = getColumns(userRole, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onApprove: handleAccepted,
    onReject: handleDeclined,
    onReset: handleReset,
  })

  return (
    <div className="space-y-4">
      <DataTable 
      columns={columns} 
      data={dayOffData ?? []} 
      searchColumn="employeeName"
      searchPlaceholder="Search by employee name"
      dateColumn="date"
      statusColumn="status"
      statusOptions={[
        { label: "Pending", value: "Pending" },
        { label: "Accepted", value: "Accepted" },
        { label: "Declined", value: "Declined" },
      ]}
      />
    </div>
  )
}

