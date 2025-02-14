import { z } from "zod";

export const formCarSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  plate: z.string().min(1, "Plate is required"),
  type: z.enum(["SEDAN", "SUV", "VAN"]),
})

export const formCarReservationSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  employeeName: z.string().min(1, "Employee name is required"),
  date: z.object({
    from: z.date({
      required_error: "Please select a start date",
    }),
    to: z.date({
      required_error: "Please select an end date",
    })
  }),
  destination: z.string().min(1, "Destination is required"),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  carId: z.string().min(1, "Car ID is required"),
  tripStatus: z.enum(["ONGOING", "COMPLETED", "CANCELLED"]),
  car: formCarSchema,
})