// form-config.ts
import { z } from "zod";

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
  confirmpassword: z.string().min(MIN_PASSWORD_LENGTH),
  role: z.enum(["EMPLOYEE","MANAGER","HR"]),
})

export const DEFAULT_FORM_VALUES = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmpassword: "",
  role: "EMPLOYEE" as "EMPLOYEE" | "MANAGER" | "HR",
};

export const PASSWORD_PLACEHOLDER = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;