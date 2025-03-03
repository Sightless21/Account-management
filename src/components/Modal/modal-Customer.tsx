"use client";

import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, Mail, Phone, User, Briefcase, Globe, Building, FileText, Hash, MessageSquare, BadgePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/formCustomizeInput";
import { type CustomerFormData, customerSchema } from "@/schema/formCustomer";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomerData";
import { toast } from "sonner";

interface CustomerDialogProps {
  customer?: CustomerFormData;
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
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

export function CustomerDialog({ customer, trigger, open: controlledOpen, onClose }: CustomerDialogProps) {
  const { mutateAsync: createCustomer }= useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const [open, setOpen] = useState(false);

  // Determine mode based on whether customer data is provided
  const mode = customer ? 'edit' : 'create';

  // Use customer data for default values if in edit mode, otherwise use defaults
  const initialValues = customer || defaultCustomerValues;

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues, // Pre-fill with customer data if editing
  });

  const handleSubmit = useCallback(
    (data: CustomerFormData) => {
      if (mode === 'edit' && customer?.id) {
        toast.promise(updateCustomer({ ...data, id: customer.id }),{
          loading: 'Updating customer...',
          success: 'Customer updated successfully',
          error: 'Failed to update customer',
        });
      } else {
        const customerData = { ...data, id: "" };
        toast.promise(createCustomer(customerData),{
          loading: 'Creating customer...',
          success: 'Customer created successfully',
          error: 'Failed to create customer',
        });
      }
      setOpen(false); // Close the modal after submission
      form.reset(defaultCustomerValues);
      if (onClose) onClose(); // Trigger onClose callback
    },
    [createCustomer, updateCustomer, mode, customer, onClose, form]
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const newOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
      setOpen(newOpen);
      if (!newOpen) {
        form.reset(initialValues); // Reset to initial values (customer data or defaults) when closing
        if (onClose) onClose(); // Trigger onClose callback
      }
    },
    [form, initialValues, controlledOpen, onClose]
  );

  const handleClose = () => {
    setOpen(false); // Explicitly close the modal
    form.reset(initialValues); // Reset to initial values (customer data or defaults)
    if (onClose) onClose(); // Trigger onClose callback
  };

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
    <Dialog open={controlledOpen !== undefined ? controlledOpen : open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-8" variant={"default"}>
            <BadgePlus /> Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="w-[700px] max-h-[100vh] h-fit overflow-y-auto bg-white border rounded-lg shadow-lg"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
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
            <div className="flex justify-end gap-2">
              <Button type="submit" className="px-8 rounded-md">
                {mode === 'edit' ? "Update Customer" : "Add Customer"}
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