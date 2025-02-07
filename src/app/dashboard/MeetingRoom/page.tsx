"use client"
import React ,{useState , useMemo, useEffect} from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BookingDialog } from "@/components/Modal/modal-Booking"
import { BookingTable } from "@/components/Table/booking-table"
import type { Booking } from "@/types/bookings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import  { useRoombookingStore }  from "@/store/useRoombookingStore"
import { toast } from "sonner"

//FIXME : Room Booking Page enchance ui or table
export default function RoomBooking() {
  const {bookings,fetchRoombookings,createRoombooking,updateRoombooking,deleteRoombooking } = useRoombookingStore();

  useEffect(() => {
    toast.promise(fetchRoombookings(),{
      loading: "Loading data...",
      success: "Data loaded successfully",
      error: "Failed to load data",
    });
  },[fetchRoombookings]);

  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined)

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch = booking.username.toLowerCase().includes(searchQuery.toLowerCase())

      if (!dateRange.from) {
        return matchesSearch
      }

      const bookingDate = new Date(booking.date)
      bookingDate.setHours(0, 0, 0, 0)

      if (dateRange.to) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        return matchesSearch && bookingDate >= fromDate && bookingDate <= toDate
      }

      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)
      return matchesSearch && bookingDate.getTime() === fromDate.getTime()
    })
  }, [bookings, searchQuery, dateRange])

  const handleAddBooking = (bookingData: Partial<Booking>) => {
    const newBooking = {
      id: "",
      ...bookingData,
    } as Booking
    console.log("newBooking : ", newBooking)
    toast.promise(createRoombooking(newBooking),{
      loading: "Loading...",
      success: "Booking created successfully",
      error: "Failed to create booking",
    });
  }

  const handleEditBooking = (bookingData: Partial<Booking>) => {
    // setBookings(bookings.map((booking) => (booking.id === selectedBooking?.id ? { ...booking, ...bookingData } : booking)),)
    if (selectedBooking) {
      toast.promise(updateRoombooking({ ...selectedBooking, ...bookingData }),{
        loading: "Loading...",
        success: "Booking updated successfully",
        error: "Failed to update booking",
      });
    }
    console.log("booking after edit Data : ", bookingData)

  }

  const handleDelete = (id: string) => {
    // setBookings(bookings.filter((booking) => booking.id !== id))
    if (selectedBooking) {
      toast.promise(deleteRoombooking(id),{
        loading: "Loading...",
        success: "Booking deleted successfully",
        error: "Failed to delete booking",
      });
    }
    console.log("booking after delete Data : ", id)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditDialogOpen(true)
  }

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined })
  }

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4 p-4 h-full">
      <Card className="p-2 h-full">
        <CardHeader>
          <CardTitle>Meeting Room Booking</CardTitle>
          <CardDescription>Manage your room booking.</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="w-full mx-auto p-2 space-y-4">
            <div className="flex flex-row sm:flex-row gap-4">
              <div className="grid gap-2">
                <Input
                  type="search"
                  placeholder="Search for Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[500px]"
                />
              </div>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="left" >
                    <div className="p-2">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                      />
                      {(dateRange.from || dateRange.to) && (
                        <div className="px-4 pb-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearDateRange}
                          >
                            Clear dates
                          </Button>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add</Button>
            </div>

            <BookingTable
              bookings={filteredBookings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <BookingDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSave={handleAddBooking}
              title="Add New Booking"
              description="Create a new room booking. Fill in all the required information."
            />

            <BookingDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              booking={selectedBooking}
              onSave={handleEditBooking}
              title="Edit Booking"
              description="Modify the booking details below."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}