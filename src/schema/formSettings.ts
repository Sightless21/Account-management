import z from "zod"


//FIX
export const settingsSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  position: z.string().min(1, "Position is required").optional(),
  militaryStatus: z.enum(["Exempted", "Not Exempted", "Pending"]).optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced"]).optional(),
  livingSituation: z.enum(["FamilyHouse", "Home", "RentHouse", "Condo"]).optional(),
  houseNo: z.string().min(1, "House number is required").optional(),
  street: z.string().min(1, "Street is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  subdistrict: z.string().min(1, "Sub-district is required").optional(),
  province: z.string().min(1, "Province is required").optional(),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters").optional(),
  nationality: z.string().min(1, "Nationality is required").optional(),
  religion: z.string().min(1, "Religion is required").optional(),
  documents: z.object({
    nationalIdCard: z.boolean().optional(),
    houseRegistration: z.boolean().optional(),
    bankAccountDetails: z.boolean().optional(),
    educationalCertificates: z.boolean().optional(),
    resume: z.boolean().optional(),
  }).optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

export const defaultValuesSettings = {
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  email: " john@example.com",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  phone: "091230321",
  position: "Fullstack Developer",
  militaryStatus: "Pending",
  maritalStatus: "single",
  livingSituation: "With Family",
  houseNo: "123/2",
  street: "321",
  district: "321",
  subdistrict: "321",
  province: "321",
  postalCode: "321",
  nationality: "Thai",
  religion: "Thai",
  documents: {
    nationalIdCard: false,
    houseRegistration: true,
    bankAccountDetails: false,
    educationalCertificates: false,
    resume: false,
  },
}

export type SettingsForm = z.infer<typeof settingsSchema>