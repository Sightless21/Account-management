import { z } from "zod"

export const customerSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  taxId: z.string().min(5, {
    message: "Tax ID must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  notes: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export type Customer = CustomerFormData & {
  id: string
}

