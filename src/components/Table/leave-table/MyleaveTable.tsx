"use client"

import { useState } from "react"
import { getColumns } from "./columns"
import type { UserRole, DayoffType } from "@/types/day-off"
import { DataTable } from "./data-table"
import { useDayOff, useDeleteDayOff, useUpdateDayOff, useUpdateStatusDayOff } from "@/hooks/useDayOffData"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DemoTableProps {
  userRole: UserRole
}

export default function DemoTable({ userRole }: DemoTableProps) {
  const { data: dayOffData, isLoading, error } = useDayOff()
  const { mutate: deleteDayOff } = useDeleteDayOff()
  const { mutate: updateDayOff } = useUpdateDayOff()
  const { mutate: updateStatusDayOff } = useUpdateStatusDayOff()

  const [nameFilter, setNameFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("")
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<string>("")


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

  const filteredData =
    dayOffData?.filter((dayOff) => {
      const nameMatch = dayOff.employeeName.toLowerCase().includes(nameFilter.toLowerCase())
      const dateMatch =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(dayOff.date.from) >= dateRange.from && new Date(dayOff.date.to) <= dateRange.to)
      const leaveTypeMatch = leaveTypeFilter === "All" || !leaveTypeFilter || dayOff.leaveType === leaveTypeFilter
      const leaveStatusMatch = leaveStatusFilter === "All" || !leaveStatusFilter || dayOff.status === leaveStatusFilter
      return nameMatch && dateMatch && leaveTypeMatch && leaveStatusMatch
    }) ?? []

  // Get unique leave types from the data
  const leaveTypes = Array.from(new Set(dayOffData?.map((dayOff) => dayOff.leaveType) ?? []))
  const LeaveStatus = Array.from(new Set(dayOffData?.map((dayOff) => dayOff.status) ?? []))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search by employee name */}
        <Input placeholder="Search by employee name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm w-[250px]" />
        {/* Select Leave Type */}
        <Select onValueChange={setLeaveTypeFilter} value={leaveTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All leave types</SelectItem>
            {leaveTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Select Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {/* Select Leave Status */}
        <Select onValueChange={setLeaveStatusFilter} value={leaveStatusFilter} >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {LeaveStatus.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={nameFilter || dateRange || leaveTypeFilter || leaveStatusFilter ? "destructive" : "outline"}
          onClick={() => {
            setNameFilter("")
            setDateRange(undefined) 
            setLeaveTypeFilter("")
            setLeaveStatusFilter("")
          }}
        >
          Reset
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}

