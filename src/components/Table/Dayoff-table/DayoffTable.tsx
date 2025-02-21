"use client"

import { getColumns } from "@/components/Table/Dayoff-table/columns"
import type { UserRole, DayoffType } from "@/types/day-off"
import { DataTable } from "@/components/Table/Data-Table"
import { useDayOff, useDeleteDayOff, useUpdateDayOff, useUpdateStatusDayOff } from "@/hooks/useDayOffData"
import { DayoffModal } from "@/components/Modal/modal-DayOff"
import { toast } from "sonner"

interface DayOffTableProps {
  userRole: UserRole
}

export default function DayOffTable({ userRole }: DayOffTableProps) {
  const { data: dayOffData, isLoading, error } = useDayOff()
  const { mutateAsync: deleteDayOff } = useDeleteDayOff()
  const { mutateAsync: updateDayOff } = useUpdateDayOff()
  const { mutateAsync: updateStatusDayOff } = useUpdateStatusDayOff()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  const handleEdit = (dayOff: DayoffType) => {
    console.log("Edit day off:", dayOff)
    toast.promise(updateDayOff({ id: dayOff.id, newData: dayOff }),{
      loading: "Saving...",
      success: "Day off updated successfully",
      error: "Error updating day off",
    })
  }

  const handleDelete = (dayOff: DayoffType) => {
    console.log("Delete day off:", dayOff)
    toast.promise(deleteDayOff(dayOff.id),{
      loading: "Deleting...",
      success: "Day off deleted successfully",
      error: "Error deleting day off",
    })
  }

  const handleAccepted = (dayOff: DayoffType) => {
    console.log("✅ Approve day off (before update):", dayOff);
    toast.promise(updateStatusDayOff({ id: dayOff.id, status: "Accepted" }),{
      loading: "Approving...",
      success: "Day off approved successfully",
      error: "Error approving day off",
    });
  }

  const handleDeclined = (dayOff: DayoffType) => {
    console.log("❌ Reject day off:", dayOff);
    toast.promise(updateStatusDayOff({ id: dayOff.id, status: "Declined" }),{
      loading: "Rejecting...",
      success: "Day off rejected successfully",
      error: "Error rejecting day off",
    });
  }

  const handleReset = (dayOff: DayoffType) => {
    console.log("Reset day off:", dayOff);
    toast.promise(updateStatusDayOff({ id: dayOff.id, status: "Pending" }),{
      loading: "Resetting...",
      success: "Day off reset successfully",
      error: "Error resetting"
    });
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
      defaultVisibleColumns={["employeeName", "leaveType" ,"date", "status", "actions"]}
      statusOptions={[
        { label: "Pending", value: "Pending" },
        { label: "Accepted", value: "Accepted" },
        { label: "Declined", value: "Declined" },
      ]}
      toolbarAdditionalControls={<DayoffModal />}/>
    </div>
  )
}

