"use client"
import { useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useRoomBookings } from "@/hooks/useRoomBookingData"
import { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { BookingDialog } from "@/components/Modal/modal-Booking"

export default function BookingRoomTable() {
  const { data: roombookings, isLoading, error } = useRoomBookings()
  const [nameFilter, setNameFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  // ฟิลเตอร์ข้อมูล
  const filteredBookings = roombookings?.filter((booking) => {
    const matchesName = nameFilter
      ? booking.username.toLowerCase().includes(nameFilter.toLowerCase())
      : true

    const matchesDate =
      dateRange?.from && dateRange?.to
        ? new Date(booking.date) >= dateRange.from &&
        new Date(booking.date) <= dateRange.to
        : true

    return matchesName && matchesDate
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Filter with Input */}
        <Input placeholder="Search by name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm w-[250px]" />
        {/* Filter with Date Range */}
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
        {/* add components */}
        <BookingDialog/>
      </div>
      <DataTable columns={columns} data={filteredBookings || []} />
    </div>
  )
}

