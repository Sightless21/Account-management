'use client'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import React, { useState } from "react"
import { useCarReservation } from "@/hooks/useCarReservationData"
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Settings2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { CarReservationDrawer } from "@/components/Drawer/drawer-CarReservation"


//TODO : Feature filter data
export default function CarReservationTable() {

  const { data: carReservations, isLoading, error } = useCarReservation()
  const [nameFilter, setNameFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  // ฟิลเตอร์ข้อมูล
  const filteredCarReservations = carReservations?.filter((carReservation) => {
    const matchesName = nameFilter
      ? carReservation.employeeName.toLowerCase().includes(nameFilter.toLowerCase())
      : true

    const matchesDate =
      dateRange?.from && dateRange?.to
        ? new Date(carReservation.date.from) >= dateRange.from &&
        new Date(carReservation.date.to) <= dateRange.to
        : true

    return matchesName && matchesDate
  })

  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between">
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
          <Button
          variant={nameFilter || dateRange ? "destructive" : "outline"}
          onClick={() => {
            setDateRange(undefined)
            setNameFilter("")
          }}>
            Reset
          </Button>
          {/* Add CarReservation */}
          <CarReservationDrawer />
        </div>
        {/* View */}
        <div className="flex flex-wrap gap-4">
          <Button className=" outline-1 outline-dashed" variant={"outline"} size={"sm"}><Settings2 className="mr-2 h-4 w-4" /> view</Button>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={filteredCarReservations || []} />
      </div>
    </div>
  )
}
