import z from "zod"


//FIX
export const settingsSchema = z.object({
  profile: z.object({
    person: z.object({
      fullName: z.string().min(3, "Full name must be at least 3 characters"),
      phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
      email: z.string().email("Invalid email address"),
      position: z.string().min(1, "Position is required").optional(),
    })
  }),
  user: z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
    confirmPassword: z.string().optional(),
  }),
  info: z.object({
    address: z.object({
      houseNumber: z.string().min(1, "House number is required"),
      village: z.string().optional(),
      road: z.string().optional(),
      subDistrict: z.string().min(2, "Sub-district must be at least 2 characters"),
      district: z.string().min(2, "District must be at least 2 characters"),
      province: z.string().min(2, "Province must be at least 2 characters"),
      zipCode: z.string().length(5, "Zip code must be 5 characters"),
      country: z.string().min(2, "Country must be at least 2 characters"),
    }),
    nationality: z.string().min(2, "Nationality must be at least 2 characters"),
    religion: z.string().min(2, "Religion must be at least 2 characters"),
    race: z.string().min(2, "Race must be at least 2 characters"),
  }),
  birthdate: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
    z.date()
      .refine((date) => date < new Date(), { message: "Birthdate must be in the past" })
      .refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const isBeforeBirthday =
          today.getMonth() < date.getMonth() ||
          (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
        return age > 18 || (age === 18 && !isBeforeBirthday);
      }, { message: "Age must be at least 18 years old" })
  ),
  military: z.enum(["pass", "discharged", "not pass"], { message: "Military status is required" }),
  marital: z.enum(["single", "married", "divorced"], { message: "Marital status is required" }),
  dwelling: z.enum(["familyHouse", "Home", "RentHouse", "Condo"], { message: "Dwelling type is required" }),
  documents: z.array(z.string()).min(1, "At least one document is required"),
})

export const defaultValuesSettings = {
  profile: {
    person: {
      fullName: "John Doe",
      phone: "091230321",
      email: " john@example.com",
      position: "Fullstack Developer",
    }
  },
  birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
  user: {
    firstName: "John",
    lastName: "Doe",
    email: " john@example.com",
    currentPassword: "password",
    newPassword: "newpassword",
    confirmPassword: "newpassword",
  },
  info: {
    address: {
      houseNumber: "123",
      village: "Village",
      road: "Road",
      subDistrict: "Sub District",
      district: "District",
      province: "Province",
      zipCode: "12345",
      country: "Country",
    },
    nationality: "Nationality",
    religion: "Religion",
    race: "Race",
  },
  military: "pass",
  marital: "single",
  dwelling: "familyHouse",
  documents: [],

}

export type SettingsForm = z.infer<typeof settingsSchema>