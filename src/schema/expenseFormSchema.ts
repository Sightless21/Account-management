import * as z from "zod";

export const expenseSchema = z.object({
  id: z.string().default(""),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  employeeName: z.string().default(""),
  transactionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
  }), // ISO string
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  status: z.enum(["Pending", "Accepted", "Declined"]).default("Pending"),
  attachmentUrl: z.string().default(""),
  attachmentPublicId: z.string().default(""),
  useForeignCurrency: z.boolean().default(false),
  country: z.string().default(""),
  expenses: z.object({
    fuel: z.object({
      liters: z.number().min(0).optional(),
      totalCost: z.number().min(0).optional(),
    }).optional(),
    accommodation: z.object({
      nights: z.number().min(0).optional(),
      totalCost: z.number().min(0).optional(),
    }).optional(),
    transportation: z.object({
      origin: z.string().optional(),
      destination: z.string().optional(),
      totalCost: z.number().min(0).optional(),
    }).optional(),
    perDiem: z.object({
      amount: z.number().min(0).optional(),
    }).optional(),
    medicalExpenses: z.object({
      amount: z.number().min(0).optional(),
      description: z.string().optional(),
    }).optional(),
    otherExpenses: z.object({
      amount: z.number().min(0).optional(),
      description: z.string().optional(),
    }).optional(),
  }).default({}),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type Expense = z.infer<typeof expenseSchema>;