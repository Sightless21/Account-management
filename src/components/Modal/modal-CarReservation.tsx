"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formCarReservationSchema } from "@/schema/formCarReservation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Clock8, CarIcon, CreditCard, MapPin, Info, ShoppingCart, User2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useUserData } from "@/hooks/useUserData";
import { useCars } from "@/hooks/useCarData"; // Only use useCars
import { useCreateCarReservation, useUpdateCarReservation } from "@/hooks/useCarReservationData";
import { Car, CarReservationType, CarType } from "@/types/car-reservation";
import { useCarReservationUI } from "@/store/useCarreservationUIStore";

type FormValues = z.infer<typeof formCarReservationSchema>;

export function CarReservationDialog() {
  const { isOpen, mode, selectedReservation, closeModal } = useCarReservationUI();
  const isReadOnly = mode === "view";
  const title = {
    create: "Create Reservation",
    edit: "Edit Reservation",
    view: "View Reservation Details",
  }[mode];

  const { data: session } = useSession();
  const { data: user } = useUserData(session?.user.id as string);
  const { data: cars = [] } = useCars(); // Only use useCars for car data
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const { mutate: createCarReservation } = useCreateCarReservation();
  const { mutate: updateCarReservation } = useUpdateCarReservation();
  // Removed useCarInfo since it's not needed

  // Memoize defaultCar to prevent re-creation on every render
  const defaultCar: Car = useMemo(
    () => ({
      id: "",
      name: "Select car",
      plate: "Select car",
      type: "SEDAN",
    }),
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formCarReservationSchema),
    mode: "onSubmit",
    defaultValues: {
      id: null,
      userId: session?.user.id as string,
      employeeName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
      destination: "",
      startTime: "08:00",
      endTime: "17:00",
      tripStatus: "ONGOING",
      date: { from: new Date(), to: new Date() },
      carId: null,
      car: defaultCar,
    },
  });

  // Sync form only when selectedReservation or mode changes meaningfully
  useEffect(() => {
    if (selectedReservation && (mode === "edit" || mode === "view")) {
      const newValues: FormValues = {
        id: selectedReservation.id || null,
        userId: selectedReservation.userId || (session?.user.id as string),
        employeeName: selectedReservation.employeeName || "",
        destination: selectedReservation.destination || "",
        startTime: selectedReservation.startTime || "08:00",
        endTime: selectedReservation.endTime || "17:00",
        tripStatus: selectedReservation.tripStatus || "ONGOING",
        date: {
          from: selectedReservation.date?.from
            ? new Date(selectedReservation.date.from)
            : new Date(),
          to: selectedReservation.date?.to
            ? new Date(selectedReservation.date.to)
            : new Date(),
        },
        carId: selectedReservation.carId || null,
        car: selectedReservation.car || defaultCar,
      };

      console.log("Edit/View Mode - Selected Reservation:", selectedReservation);
      console.log("New Values:", newValues);

      const currentValues = form.getValues();
      if (JSON.stringify(currentValues) !== JSON.stringify(newValues)) {
        form.reset(newValues);
      }
      if (selectedCarId !== selectedReservation.carId) {
        setSelectedCarId(selectedReservation.carId || null);
      }
    } else if (mode === "create") {
      const defaultValues: FormValues = {
        id: null,
        userId: session?.user.id as string,
        employeeName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
        destination: "",
        startTime: "08:00",
        endTime: "17:00",
        tripStatus: "ONGOING",
        date: { from: new Date(), to: new Date() },
        carId: null,
        car: defaultCar,
      };
      const currentValues = form.getValues();
      if (JSON.stringify(currentValues) !== JSON.stringify(defaultValues)) {
        form.reset(defaultValues);
      }
      if (selectedCarId !== null) {
        setSelectedCarId(null);
      }
    }
  }, [selectedReservation, mode, form, session?.user.id, selectedCarId, user, defaultCar]);

  const handleCarChange = (carId: string) => {
    if (!isReadOnly) {
      console.log("Car ID selected:", carId);

      const selectedCarDetails = cars.find((car) => car.id === carId);
      console.log("Found car details:", selectedCarDetails);

      if (selectedCarDetails) {
        // First set the carId
        form.setValue("carId", carId);

        // Then set the entire car object
        const carData = {
          id: selectedCarDetails.id,
          name: selectedCarDetails.name,
          plate: selectedCarDetails.plate,
          type: selectedCarDetails.type as CarType
        };

        console.log("Setting car data:", carData);

        // Set the car object
        form.setValue("car", carData);

        // Set each field individually to ensure updates
        form.setValue("car.name", selectedCarDetails.name);
        form.setValue("car.plate", selectedCarDetails.plate);
        form.setValue("car.type", selectedCarDetails.type);

        // Force form update
        form.trigger();
      }
    }
  };

  useEffect(() => {
    if (selectedCarId && !isReadOnly) {
      const selectedCarDetails = cars.find((car) => car.id === selectedCarId) || defaultCar;
      form.setValue("car", selectedCarDetails);
      form.setValue("car.name", selectedCarDetails.name);
      form.setValue("car.plate", selectedCarDetails.plate);
      form.setValue("car.type", selectedCarDetails.type);
    }
  }, [selectedCarId, cars, form, isReadOnly, defaultCar]);

  const onSubmit = (values: FormValues) => {
    const selectedCarValue = values.car || defaultCar; // Use form's car value directly
    const reservation: CarReservationType = {
      ...values,
      id: values.id || selectedReservation?.id || "",
      carId: selectedCarId ?? "",
      car: {
        id: selectedCarValue.id ?? "",
        name: selectedCarValue.name,
        plate: selectedCarValue.plate,
        type: selectedCarValue.type,
      },
      tripStatus: values.tripStatus || "ONGOING",
    };
    if (mode === "edit" && reservation.id) {
      updateCarReservation(reservation);
    } else if (mode === "create") {
      createCarReservation(reservation);
    }
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[1000px] h-fit overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {isReadOnly
                  ? "View the details of this car reservation."
                  : "Please fill in the details for your car reservation."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex items-center">
                        <User2Icon className="mr-2" />Employee Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex items-center">
                        <CarIcon className="mr-2" />Select a Car
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleCarChange(value);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                        disabled={isReadOnly}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a car">
                              {field.value ? cars.find(car => car.id === field.value)?.name : "Select a car"}
                            </SelectValue>
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
                <FormField
                  control={form.control}
                  name="car.name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="inline-flex items-center">
                          <Info className="mr-2" />Car Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="car.plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex items-center">
                        <CreditCard className="mr-2" />Plate
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true} // Always disabled
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="car.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex items-center">
                        <ShoppingCart className="mr-2" />Type
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true} // Always disabled
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="inline-flex items-center">
                          <CalendarIcon className="mr-2" />Date Range
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled={isReadOnly}>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, "LLL dd, y")} -{" "}
                                      {format(field.value.to, "LLL dd, y")}
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
                                field.onChange(newDate);
                                if (newDate?.from && newDate?.to) {
                                  document.body.click();
                                }
                              }}
                              numberOfMonths={2}
                              disabled={isReadOnly}
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
                        <FormLabel className="inline-flex items-center">
                          <Clock className="mr-2" />Start Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={isReadOnly}
                          />
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
                        <FormLabel className="inline-flex items-center">
                          <Clock8 className="mr-2" />End Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={isReadOnly}
                          />
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
                    <FormLabel className="inline-flex items-center">
                      <MapPin className="mr-2" />Destination
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {!isReadOnly && (
                <>
                  <Button type="submit">
                    {mode === "create" ? "Create Reservation" : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </>
              )}
              {isReadOnly && (
                <Button type="button" variant="outline" onClick={closeModal}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}