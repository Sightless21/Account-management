/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { House, Mailbox, Mail, Phone, User, Briefcase, Globe, MapPin, Flag, Book, Banknote, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/formCustomerInput";
import { formApplicantSchema, APPLICANT_FORM_DEFAULT_VALUES } from "@/schema/formApplicantV2";
import { FormApplicant } from "@/types/applicant";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateApplicant, useUpdateApplicant } from "@/hooks/useApplicantData";
import { ReusableTabs } from "@/components/tabInfo"

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

  const iconMap = {
    name: User,
    phone: Phone,
    email: Mail,
    position: Briefcase,
    expectSalary: Banknote,
    houseNumber: House,
    village: MapPin,
    road: MapPin,
    subDistrict: MapPin,
    district: MapPin,
    province: MapPin,
    zipCode: Mailbox,
    country: Flag,
    nationality: Flag,
    religion: Book,
    race: Globe,
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

  const personalTabContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          name="person.name"
          label="Applicant Name"
          icon={iconMap.name}
          placeholder="Enter applicant name"
          control={form.control}
          required={requiredFields.includes("person.name")}
        />
        <FormInput
          name="person.phone"
          label="Phone Number"
          icon={iconMap.phone}
          placeholder="0123456789"
          control={form.control}
          component="phone"
          required={requiredFields.includes("person.phone")}
        />
        <FormInput
          name="person.email"
          label="Email"
          icon={iconMap.email}
          placeholder="Enter email address"
          control={form.control}
          type="email"
          required={requiredFields.includes("person.email")}
        />
        <FormInput
          name="person.position"
          label="Position"
          icon={iconMap.position}
          placeholder="Enter position"
          control={form.control}
          required={requiredFields.includes("person.position")}
        />
        <FormInput
          name="person.expectSalary"
          label="Expected Salary"
          icon={iconMap.expectSalary}
          placeholder="Enter expected salary"
          control={form.control}
          required={requiredFields.includes("person.expectSalary")}
        />
        <FormInput
          name="birthdate"
          label="Birth Date"
          control={form.control}
          required={requiredFields.includes("birthdate")}
          component="birthdate"
        />
      </div>
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
          <CardContent>
            <FormInput
              name="military"
              label="Military Status"
              component="radio"
              control={form.control}
              options={militaryOptions}
              required={requiredFields.includes("military")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
          <CardContent>
            <FormInput
              name="marital"
              label="Marital Status"
              component="radio"
              control={form.control}
              options={maritalOptions}
              required={requiredFields.includes("marital")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-none">
          <CardContent>
            <FormInput
              name="dwelling"
              label="Dwelling Type"
              component="radio"
              control={form.control}
              options={dwellingOptions}
              required={requiredFields.includes("dwelling")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // เนื้อหาของแท็บ Address Details
  const addressTabContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          name="info.address.houseNumber"
          label="House Number"
          icon={iconMap.houseNumber}
          placeholder="Enter house number"
          control={form.control}
          required={requiredFields.includes("info.address.houseNumber")}
        />
        <FormInput
          name="info.address.village"
          label="Village"
          icon={iconMap.village}
          placeholder="Enter village (optional)"
          control={form.control}
        />
        <FormInput
          name="info.address.road"
          label="Road"
          icon={iconMap.road}
          placeholder="Enter road (optional)"
          control={form.control}
        />
        <FormInput
          name="info.address.subDistrict"
          label="Sub-District"
          icon={iconMap.subDistrict}
          placeholder="Enter sub-district"
          control={form.control}
          required={requiredFields.includes("info.address.subDistrict")}
        />
        <FormInput
          name="info.address.district"
          label="District"
          icon={iconMap.district}
          placeholder="Enter district"
          control={form.control}
          required={requiredFields.includes("info.address.district")}
        />
        <FormInput
          name="info.address.province"
          label="Province"
          icon={iconMap.province}
          placeholder="Enter province"
          control={form.control}
          required={requiredFields.includes("info.address.province")}
        />
        <FormInput
          name="info.address.zipCode"
          label="Zip Code"
          icon={iconMap.zipCode}
          placeholder="Enter zip code"
          control={form.control}
          required={requiredFields.includes("info.address.zipCode")}
        />
        <FormInput
          name="info.address.country"
          label="Country"
          icon={iconMap.country}
          placeholder="Enter country"
          control={form.control}
          required={requiredFields.includes("info.address.country")}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormInput
          name="info.nationality"
          label="Nationality"
          icon={iconMap.nationality}
          placeholder="Enter nationality"
          control={form.control}
          required={requiredFields.includes("info.nationality")}
        />
        <FormInput
          name="info.religion"
          label="Religion"
          icon={iconMap.religion}
          placeholder="Enter religion"
          control={form.control}
          required={requiredFields.includes("info.religion")}
        />
        <FormInput
          name="info.race"
          label="Race"
          icon={iconMap.race}
          placeholder="Enter race"
          control={form.control}
          required={requiredFields.includes("info.race")}
        />
      </div>
    </div>
  );

  // เนื้อหาของแท็บ Documents
  const documentsTabContent = (
    <ScrollArea className="h-fit pr-4">
      <FormInput
        name="documents"
        label="Required Documents"
        description="Please ensure all required documents are submitted"
        component="checkbox"
        control={form.control}
        options={documentOptions}
        required
        className="space-y-4"
      />
    </ScrollArea>
  );

  // รายการแท็บ
  const tabs = [
    { label: "Personal Information", value: "personal", content: personalTabContent },
    { label: "Address Details", value: "address", content: addressTabContent },
    { label: "Documents", value: "documents", content: documentsTabContent },
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

            <ReusableTabs tabs={tabs} defaultValue="personal" className="space-y-4" />

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