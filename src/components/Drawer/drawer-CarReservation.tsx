"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { formCarReservationSchema } from "@/schema/formCarReservation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { z } from "zod"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, BadgePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useUserData } from "@/hooks/useUserData"
import { useCarInfo, useCars } from "@/hooks/useCarData"
import { useCreateCarReservation } from "@/hooks/useCarReservationData"
import { Car, CarReservationType } from "@/types/car-reservation"

type FormValues = z.infer<typeof formCarReservationSchema>

export function CarReservationDrawer() {
  const { data: session } = useSession()
  const { data: user } = useUserData(session?.user.id as string)
  const userinfo = user
  const { data: cars = [] } = useCars()
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const { data: selectedCar } = useCarInfo({ id: selectedCarId ?? "" })
  const { mutate: CreateCarReservation } = useCreateCarReservation()

  const defaultCar: Car = {
    id: "",
    name: "Select car",
    plate: "select car",
    type: "SEDAN"
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formCarReservationSchema),
    mode: "onSubmit",
    defaultValues: {
      id : null,
      userId: session?.user.id as string,
      employeeName: userinfo?.firstName + " " + userinfo?.lastName,
      destination: "",
      startTime: "08:00",
      endTime: "17:00",
      tripStatus: "ONGOING",
      date: {
        from: new Date(),
        to: new Date(),
      },
      carId: null,
      car: defaultCar,
    },
  })

  // อัปเดตค่าเมื่อเลือก Car
  const handleCarChange = (carId: string) => {
    setSelectedCarId(carId)
    form.setValue("carId", carId)
    
    const selectedCarDetails = cars.find(car => car.id === carId)
    if (selectedCarDetails) {
      form.setValue("car", selectedCarDetails)
    }
  }

  const onSubmit = (values: FormValues) => {
    const reservation: CarReservationType = {
      ...values,
      id: values.id,
      carId: selectedCarId ?? "",  // Ensure carId is never null
      car: selectedCar ?? defaultCar,
    }
    CreateCarReservation(reservation)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"default"} className="h-8"><BadgePlus />Create Car Reservation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DrawerHeader>
              <DrawerTitle>Car Reservation</DrawerTitle>
              <DrawerDescription>Please fill in the details for your car reservation.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carId"
                  render={({ }) => (
                    <FormItem>
                      <FormLabel>Select a Car</FormLabel>
                      <Select onValueChange={handleCarChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a car" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cars.map((car) => (
                            <SelectItem key={car.id} value={car.id}>
                              {car.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormItem>
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input value={selectedCar?.name ?? ""} disabled />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Plate</FormLabel>
                  <FormControl>
                    <Input value={selectedCar?.plate ?? ""} disabled />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input value={selectedCar?.type ?? ""} disabled />
                  </FormControl>
                </FormItem>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Range</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(field.value.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={(newDate) => {
                                field.onChange(newDate)
                                if (newDate?.from && newDate?.to) {
                                  // Close the popover only when both dates are selected
                                  document.body.click() // This will close the popover
                                }
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-50" />
                            <Input
                              type="time"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </div>
                        </FormControl>
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
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-50" />
                            <Input
                              type="time"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>

            <DrawerFooter>
              <Button type="submit">Submit Reservation</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

