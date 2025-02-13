import { z } from "zod" 

// Define the form schema using Zod
export const roomBookingFormSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, "Name is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
}).refine((data) => {
  const start = parseInt(data.startTime.split(":")[0])
  const end = parseInt(data.endTime.split(":")[0])
  return end > start
}, {
  message: "End time must be after start time",
  path: ["endTime"],
})