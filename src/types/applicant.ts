import {formApplicantSchema} from "@/schema/formApplicantV2"
import z from "zod"

export type FormApplicant = z.infer<typeof formApplicantSchema>;

export type ApplicantStatusType = FormApplicant["status"];

export type Document = {
  id: string;
  name: string;
  applicantId: string;
  employeeId: string | null;
};