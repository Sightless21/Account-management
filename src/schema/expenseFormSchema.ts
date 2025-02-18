import * as z from "zod"

export const expenseFormSchema = z.object({
  id: z.string().nullable(),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  employeename: z.string().optional(),
  transactionDate: z.date({ required_error: "A transaction date is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(['Pending','Accepted','Declined']).default("Pending"),
  attachment: z.instanceof(File).optional(),
  useForeignCurrency: z.boolean().default(false),
  country: z.string().optional(),
  expenses: z.object({
    fuel: z.object({
      liters: z.number().min(0).optional(),
      totalCost: z.number().min(0).optional(),
    }),
    accommodation: z.object({
      nights: z.number().min(0).optional(),
      totalCost: z.number().min(0).optional(),
    }),
    transportation: z.object({
      origin: z.string().optional(),
      destination: z.string().optional(),
      totalCost: z.number().min(0).optional(),
    }),
    perDiem: z.object({
      amount: z.number().min(0).optional(),
    }),
    medicalExpenses: z.object({
      amount: z.number().min(0).optional(),
      description: z.string().optional(),
    }),
    otherExpenses: z.object({
      amount: z.number().min(0).optional(),
      description: z.string().optional(),
    }),
  }),
})

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>

