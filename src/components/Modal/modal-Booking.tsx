import React, { useState } from "react"
import { BadgePlus, CalendarIcon, PencilIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { RoombookingType } from "@/types/room-bookings"
import { roomBookingFormSchema } from "@/schema/formRoomBooking"
import { useUserData } from "@/hooks/useUserData"
import { useSession } from "next-auth/react"
import { useCreateRoomBooking, useUpdateRoomBooking } from "@/hooks/useRoomBookingData"

type BookingFormValues = z.infer<typeof roomBookingFormSchema>

interface BookingDialogProps {
  mode?: "edit"
  defaultvalue?: RoombookingType
}

export function BookingDialog({ defaultvalue, mode }: BookingDialogProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const { data: user } = useUserData(session?.user.id as string)
  const userinfo = user
  const { mutate: createRoomBooking } = useCreateRoomBooking()
  const { mutate: updateRoomBooking } = useUpdateRoomBooking()


  const form = useForm<BookingFormValues>({
    resolver: zodResolver(roomBookingFormSchema),
    mode: "onChange",
    defaultValues: defaultvalue ? {
      username: defaultvalue?.username || "",
      date: defaultvalue.date ? new Date(defaultvalue.date) : undefined,
      startTime: defaultvalue?.startTime || "",
      endTime: defaultvalue?.endTime || "",
    } : {
      username: userinfo?.firstName + " " + userinfo?.lastName as string,
      date: new Date(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  })


  const onSubmit = (value: BookingFormValues) => {
    console.log("Values :",value)
    if (!value.date || !value.startTime || !value.endTime){
      return;
    }

    const formatData = {
      id: defaultvalue?.id || "",
      username : value?.username,
      date: value?.date || new Date(),
      startTime : value?.startTime || "",
      endTime : value?.endTime || "",
    }
    console.log("Format Data :",formatData)

    if (mode === "edit") {
      updateRoomBooking(formatData)
    } else {
      createRoomBooking(formatData)
      form.reset()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            variant={"outline"}
            size="icon"
            className="h-8 w-8"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) :
          <Button variant={"default"}>
            <BadgePlus /> Booking Meeting Room
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[678px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit RoomBooking": "Meeting room booking"}</DialogTitle>
          <DialogDescription>Enter the details for the room booking.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 9 }, (_, i) => i + 10).map((hour) => (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"}>Cancel</Button>
              </DialogClose>
              <Button type="submit">{mode === "edit" ? "Update Booking" : "Booking Meeting Room"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}