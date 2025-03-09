import z from "zod";

export const settingsSchema = z.object({
  avatar: z.string().optional(),
  avatarPublicId: z.string().optional(), 
  profile: z.object({
    person: z.object({
      fullName: z.string().min(3, "Full name must be at least 3 characters").optional(),
      phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
      email: z.string().email("Invalid email address").optional(),
      position: z.string().min(1, "Position is required").optional(),
      salary: z.number()
    }),
  }),
  user: z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters").optional(),
    lastName: z.string().min(3, "Last name must be at least 3 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    currentPassword: z.string().optional(), // ทำให้ optional
    newPassword: z.string().optional(), // ทำให้ optional
    confirmPassword: z.string().optional(), // ทำให้ optional
  }).refine(
    (data) => {
      // ถ้ามีการกรอก newPassword หรือ confirmPassword ต้องมี currentPassword
      if ((data.newPassword || data.confirmPassword) && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required when changing to a new password",
      path: ["currentPassword"],
    }
  ).refine(
    (data) => {
      // ถ้ามี newPassword และ confirmPassword ต้องตรงกัน
      if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password and confirm password must match",
      path: ["confirmPassword"],
    }
  ).refine(
    (data) => {
      // ถ้ามี newPassword ต้องมีความยาวอย่างน้อย 6 ตัวอักษร
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be at least 6 characters",
      path: ["newPassword"],
    }
  ),
  info: z.object({
    address: z.object({
      houseNumber: z.string().min(1, "House number is required").optional(),
      village: z.string().optional(),
      road: z.string().min(2, "Road must be at least 2 characters").optional(),
      subDistrict: z.string().min(2, "Sub-district must be at least 2 characters").optional(),
      district: z.string().min(2, "District must be at least 2 characters").optional(),
      province: z.string().min(2, "Province must be at least 2 characters").optional(),
      zipCode: z.string().length(5, "Zip code must be 5 characters").optional(),
      country: z.string().min(2, "Country must be at least 2 characters").optional(),
    }),
    nationality: z.string().min(2, "Nationality must be at least 2 characters").optional(),
    religion: z.string().min(2, "Religion must be at least 2 characters").optional(),
    race: z.string().min(2, "Race must be at least 2 characters").optional(),
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
  ).optional(),
  military: z.enum(["pass", "discharged", "not pass"], { message: "Military status is required" }).default("pass"),
  marital: z.enum(["single", "married", "divorced"], { message: "Marital status is required" }).default("single"),
  dwelling: z.enum(["familyHouse", "Home", "RentHouse", "Condo"], { message: "Dwelling type is required" }).default("familyHouse"),
  documents: z.array(z.string()).min(1, "At least one document is required").optional(),
});

export const defaultValuesSettings = {
  avatar : "",
  avatarPublicId : "",
  profile: {
    person: {
      fullName: "",
      phone: "",
      email: "",
      position: "",
      salary: 0,
    },
  },
  birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
  user: {
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  info: {
    address: {
      houseNumber: "",
      village: "",
      road: "",
      subDistrict: "",
      district: "",
      province: "",
      zipCode: "",
      country: "",
    },
    nationality: "",
    religion: "",
    race: "",
  },
  military: "pass" as SettingsForm["military"],
  marital: "single" as SettingsForm["marital"],
  dwelling: "familyHouse" as SettingsForm["dwelling"],
  documents: [],
};

export type SettingsForm = z.infer<typeof settingsSchema>;