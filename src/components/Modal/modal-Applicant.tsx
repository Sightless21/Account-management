/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { formApplicantSchema, APPLICANT_FORM_DEFAULT_VALUES } from "@/schema/formApplicant";
import { FormApplicant } from "@/types/applicant";
import { toast } from "sonner";
import { useCreateApplicant, useUpdateApplicant } from "@/hooks/useApplicantData";
import { TabsInformation } from "@/components/TabInformation";
import { BadgePlus } from "lucide-react";

interface ApplicantDialogProps {
  applicant?: FormApplicant;
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export function ApplicantDialog({ applicant, trigger, open: controlledOpen, onClose }: ApplicantDialogProps) {
  const [open, setOpen] = useState(false);
  const mode = applicant ? "edit" : "create";
  const initialValues = applicant || APPLICANT_FORM_DEFAULT_VALUES;
  const { mutateAsync: createApplicant } = useCreateApplicant();
  const { mutateAsync: updateApplicant } = useUpdateApplicant();

  const form = useForm<FormApplicant>({
    mode: "onChange",
    resolver: zodResolver(formApplicantSchema),
    defaultValues: initialValues,
  });

  // Reset ฟอร์มเมื่อ applicant เปลี่ยน
  useEffect(() => {
    form.reset(initialValues);
  }, [applicant, form, initialValues]);

  const handleSubmit = useCallback(
    (data: FormApplicant) => {
      console.log("Submitted Data:", data);
      if (mode === "edit" && applicant?.id) {
        toast.promise(updateApplicant(data), {
          loading: "Updating applicant...",
          success: "Applicant updated successfully",
          error: "Failed to update applicant",
        });
      } else {
        toast.promise(createApplicant(data), {
          loading: "Creating applicant...",
          success: "Applicant created successfully",
          error: "Failed to create applicant",
        });
      }
      setOpen(false);
      form.reset(initialValues);
      if (onClose) onClose();
    },
    [mode, applicant, form, onClose, createApplicant, updateApplicant, initialValues]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const newOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
      setOpen(newOpen);
      if (!newOpen) {
        form.reset(initialValues);
        if (onClose) onClose();
      }
    },
    [form, initialValues, controlledOpen, onClose]
  );

  const handleClose = () => {
    setOpen(false);
    form.reset(initialValues);
    if (onClose) onClose();
  };

  const onError = (errors: any) => {
    const missingFields = Object.keys(errors).map((key) => {
      if (key === "person" || key === "info") {
        return Object.keys(errors[key]).map((subKey) =>
          `${key}.${subKey}: ${errors[key][subKey].message}`
        );
      } else if (key === "documents") {
        return "Documents: At least one document is required";
      }
      return `${key}: ${errors[key].message}`;
    }).flat();
    toast.error("Please fill in all required fields:", {
      style: {},
      description: missingFields.join("\n"),
    });
  };

  const requiredFields = [
    "person.name",
    "person.phone",
    "person.email",
    "person.position",
    "birthdate",
    "info.address.houseNumber",
    "info.address.subDistrict",
    "info.address.district",
    "info.address.province",
    "info.address.zipCode",
    "info.address.country",
    "info.nationality",
    "info.religion",
    "info.race",
    "expectSalary",
    "military",
    "marital",
    "dwelling",
    "documents",
  ];

  const documentOptions = [
    { label: "National ID Card Copy", value: "national_id", description: "Clear copy of your national ID card (front and back)" },
    { label: "House Registration Copy", value: "house_registration", description: "Official copy of your house registration document" },
    { label: "Bank Account Details", value: "bank_details", description: "Copy of bank book or bank statement" },
    { label: "Educational Certificates", value: "education_cert", description: "Copies of your educational certificates and transcripts" },
    { label: "Resume/CV", value: "resume", description: "Updated resume or curriculum vitae" },
  ];

  const militaryOptions = [
    { label: "Exempted", value: "pass" },
    { label: "Discharged", value: "discharged" },
    { label: "Not Exempted", value: "not pass" },
  ];

  const maritalOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
  ];

  const dwellingOptions = [
    { label: "Family House", value: "familyHouse" },
    { label: "Own Home", value: "Home" },
    { label: "Rented House", value: "RentHouse" },
    { label: "Condo", value: "Condo" },
  ];

  return (
    <Dialog open={controlledOpen !== undefined ? controlledOpen : open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-8" variant="default">
            <BadgePlus /> Add Applicant
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="w-[1000px] max-h-[90vh] h-fit overflow-y-auto bg-white dark:bg-black border rounded-lg shadow-lg"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Applicant" : "Add New Applicant"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update applicant information below."
              : "Enter new applicant information below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-6">
            <TabsInformation
              form={form}
              requiredFields={requiredFields}
              documentOptions={documentOptions}
              militaryOptions={militaryOptions}
              maritalOptions={maritalOptions}
              dwellingOptions={dwellingOptions}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" className="px-8 rounded-md">
                {mode === "edit" ? "Update Applicant" : "Add Applicant"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="destructive" onClick={handleClose}>
                  Close
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}