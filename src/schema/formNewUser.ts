import { z } from "zod";
import {Role} from "@/types/users"

export const MIN_PASSWORD_LENGTH = 6;
export const PHONE_LENGTH = 10;

export const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  phone: z.string()
    .length(PHONE_LENGTH, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Must contain only numbers"),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH),
  role: z.enum(["EMPLOYEE","MANAGER","HR","ADMIN"]),
})

export const DEFAULT_FORM_VALUES = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "EMPLOYEE" as Role,
};

export const PASSWORD_PLACEHOLDER = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;