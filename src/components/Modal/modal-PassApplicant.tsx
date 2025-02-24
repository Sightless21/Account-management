// PassDialog.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { Applicant } from "../../app/dashboard/Applicant/Probation/columns";
import { generateCustomPassword } from "@/utils/passwordGenerate";
import { convertApplicantToEmployee } from "@/actions/convertApplicantToEmployee";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";

const userSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.literal("EMPLOYEE"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserForm = z.infer<typeof userSchema>;

interface PassDialogProps {
  applicant: Applicant;
  onPassComplete: (email: string) => void;
}

const splitFullName = (fullName: string): [string, string] => {
  const parts = fullName.split(" ");
  return parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [parts[0], ""];
};

const generateDefaultEmail = (firstName: string, lastName: string): string =>
  `${firstName.toLowerCase()}.${lastName.toLowerCase().slice(0, 1)}@japansystem.co.th`;

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string, name?: string) => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
};

const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  type = "text",
  placeholder,
}: FormFieldProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    {id === "phone" ? (
      <PhoneInput id={id} name={id} value={value} onChange={onChange} disabled={disabled} className="w-full"/>
    ) : id.includes("password") ? (
      <PasswordInput id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} className="w-full"/>
    ) : (
      <Input id={id} name={id} type={type} value={value} onChange={onChange} disabled={disabled} className="w-full"/>
    )}
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

export const PassDialog = ({ applicant, onPassComplete }: PassDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const [firstName, lastName] = splitFullName(applicant.name);
  const initialFormData: UserForm = {
    firstName,
    lastName: lastName || "",
    email: generateDefaultEmail(firstName, lastName),
    phone: applicant.phone || "",
    role: "EMPLOYEE",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState<UserForm>(initialFormData);

  const mutation = useMutation({
    mutationFn: convertApplicantToEmployee,
    onSuccess: (result) => {
      toast.success(result.message);
      onPassComplete(formData.email);
      queryClient.invalidateQueries({ queryKey: ["applicants"] }); // รีเฟรชข้อมูลอัตโนมัติ
      setIsOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name?: string
  ) => {
    const value = typeof e === "string" && name ? e : (e as React.ChangeEvent<HTMLInputElement>).target.value;
    const fieldName = name || (e as React.ChangeEvent<HTMLInputElement>).target.name;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleGeneratePassword = () => {
    const newPassword = generateCustomPassword({
      length: 6,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSpecial: false,
    });
    setFormData((prev) => ({
      ...prev,
      password: newPassword,
      confirmPassword: newPassword,
    }));
    setErrors({});
  };

  const handleCreateUser = async () => {
    try {
      const validation = userSchema.safeParse(formData);
      if (!validation.success) {
        const newErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      mutation.mutate({
        applicantId: applicant.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isLoading} onClick={() => setIsOpen(true)}>
          Pass
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit h-fit">
        <DialogHeader>
          <DialogTitle>Create Employee from Applicant</DialogTitle>
          <DialogDescription>
            Convert {applicant.name} ({applicant.position}) into an employee user account.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 space-y-2">
          <FormField id="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} disabled={isLoading} />
          <FormField id="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} disabled={isLoading} />
          <FormField id="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} disabled={isLoading} />
          <FormField id="phone" label="Phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} disabled={isLoading} />
          <FormField id="role" label="Role" value={formData.role} onChange={handleInputChange} disabled={true} />
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2 w-full">
              <FormField id="password" label="" placeholder="Enter password" value={formData.password} onChange={handleInputChange} error={errors.password} disabled={isLoading} />
              <Button variant="outline" onClick={handleGeneratePassword} disabled={isLoading}>
                Generate
              </Button>
            </div>
          </div>
          <FormField id="confirmPassword" label="Confirm Password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} disabled={isLoading} />
          <div className="text-sm text-gray-500">
            Password must contain at least:
            <ul className="list-disc pl-4">
              <li>6 characters</li>
              <li>1 uppercase letter</li>
              <li>1 number</li>
            </ul>
          </div>
        </div>
        {errors.general && (
          <div className="text-red-500 text-sm mt-2">{errors.general}</div>
        )}
        <DialogFooter>
          <Button variant="outline" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleCreateUser} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};