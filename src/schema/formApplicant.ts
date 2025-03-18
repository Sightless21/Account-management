import { FormApplicant } from "@/types/applicant";
import { z } from "zod";

export const formApplicantSchema = z.object({
  id: z.string().optional(),
  person: z.object({
    name: z.string().min(6, "Name must be at least 6 characters"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
    email: z.string().email("Invalid email"),
    position: z.string().min(5, "Position must be at least 5 characters"),
    expectSalary: z.number().min(10000, "Salary must be at least 10000 THB"),
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
  military: z.enum(["pass", "discharged", "not pass"], { message: "Military status is required" }),
  marital: z.enum(["single", "married", "divorced"], { message: "Marital status is required" }),
  dwelling: z.enum(["familyHouse", "Home", "RentHouse", "Condo"], { message: "Dwelling type is required" }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  documents: z.array(z.string()).min(1, "At least one document is required"),
  status: z.enum(["NEW", "PENDING_INTERVIEW", "INTERVIEW_PASSED"]).default("NEW"),
  order: z.number().optional(),
});

export const APPLICANT_FORM_DEFAULT_VALUES: FormApplicant = {
  id: "",
  person: {
    name: "",
    phone: "",
    email: "",
    position: "",
    expectSalary: 0,
  },
  birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
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
  military: "pass",
  marital: "single",
  dwelling: "familyHouse",
  createdAt: "",
  updatedAt: "",
  documents: [],
  status: "NEW",
};