"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, Mail, Phone, User, Briefcase, Globe, Building, FileText, Hash, MessageSquare, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/formCustomerInput"
import { type CustomerFormData, customerSchema } from "@/schema/formCustomer";

interface CustomerDialogProps {
  customer?: CustomerFormData;
  trigger?: React.ReactNode;
}

const defaultCustomerValues: CustomerFormData = {
  companyName: "",
  contactPerson: "",
  position: "",
  address: "",
  phoneNumber: "",
  taxId: "",
  email: "",
  website: "",
  industry: "",
  notes: "",
};

export function CustomerDialog({ customer,  trigger }: CustomerDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || defaultCustomerValues,
  });

  const handleSubmit = useCallback(
    (data: CustomerFormData) => {
      console.log(data);
      setOpen(false);
      form.reset(customer || defaultCustomerValues);
    },
    [ form, customer]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen && !form.formState.isSubmitted) {
        form.reset(customer || defaultCustomerValues);
      }
    },
    [form, customer]
  );

  const iconMap = {
    companyName: Building2,
    contactPerson: User,
    position: Briefcase,
    phoneNumber: Phone,
    email: Mail,
    taxId: Hash,
    website: Globe,
    industry: Building,
    address: FileText,
    notes: MessageSquare,
  };

  const requiredFields = [
    "companyName",
    "contactPerson",
    "position",
    "phoneNumber",
    "email",
    "taxId",
    "address",
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{
        trigger ||
        <Button className="h-8" variant={"default"} ><BadgePlus />Add Customer</Button>
      }
      </DialogTrigger>
      <DialogContent className="w-[700px] max-h-[100vh] h-[850px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Update customer information below."
              : "Enter new customer information below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormInput
                name="companyName"
                label="Company Name"
                icon={iconMap.companyName}
                placeholder="Enter company name"
                control={form.control}
                required={requiredFields.includes("companyName")}
              />
              <FormInput
                name="contactPerson"
                label="Contact Person"
                icon={iconMap.contactPerson}
                placeholder="Enter contact person name"
                control={form.control}
                required={requiredFields.includes("contactPerson")}
              />
              <FormInput
                name="position"
                label="Position"
                icon={iconMap.position}
                placeholder="Enter position"
                control={form.control}
                required={requiredFields.includes("position")}
              />
              <FormInput
                name="phoneNumber"
                label="Phone Number"
                icon={iconMap.phoneNumber}
                placeholder="(XXX) XXX-XXXX"
                control={form.control}
                component="phone"
                required={requiredFields.includes("phoneNumber")}
              />
              <FormInput
                name="email"
                label="Email"
                icon={iconMap.email}
                placeholder="Enter email address"
                control={form.control}
                type="email"
                required={requiredFields.includes("email")}
              />
              <FormInput
                name="taxId"
                label="Tax ID"
                icon={iconMap.taxId}
                placeholder="Enter tax ID"
                control={form.control}
                required={requiredFields.includes("taxId")}
              />
              <FormInput
                name="website"
                label="Website"
                icon={iconMap.website}
                placeholder="Enter website URL"
                control={form.control}
                type="url"
                required={requiredFields.includes("website")}
              />
              <FormInput
                name="industry"
                label="Industry"
                icon={iconMap.industry}
                placeholder="Enter industry (optional)"
                control={form.control}
                required={requiredFields.includes("industry")}
              />
            </div>
            <div className="col-span-full">
              <FormInput
                name="address"
                label="Address"
                icon={iconMap.address}
                placeholder="Enter complete address"
                control={form.control}
                required={requiredFields.includes("address")}
              />
            </div>
            <FormInput
              name="notes"
              label="Notes"
              icon={iconMap.notes}
              placeholder="Enter any additional notes"
              control={form.control}
              component="textarea"
              className="min-h-[100px]"
              required={requiredFields.includes("notes")}
            />
            <div className="flex justify-end">
              <Button type="submit" className="px-8 rounded-md" size="lg">
                {customer ? "Update Customer" : "Add Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}