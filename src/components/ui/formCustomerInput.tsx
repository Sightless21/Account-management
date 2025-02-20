/* eslint-disable @typescript-eslint/no-explicit-any */
// FormInput.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { type Control } from "react-hook-form";

interface FormInputProps {
  name: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  control?: Control<any>;
  type?: string;
  component?: "input" | "textarea" | "phone";
  required?: boolean;
  className?: string;
}

export function FormInput({
  name,
  label,
  icon: Icon,
  placeholder,
  control,
  type,
  component = "input",
  required,
  className,
}: FormInputProps) {
  const RequiredIndicator = () => required ? <span className="text-destructive">*</span> : null;

  const renderInput = ({ field }: { field: any }) => {
    switch (component) {
      case "textarea":
        return (
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea {...field} className={`pl-9 ${className || ""}`} placeholder={placeholder} />
          </div>
        );
      case "phone":
        return (
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <PhoneInput {...field} className={`pl-9 ${className || ""}`} placeholder={placeholder} />
          </div>
        );
      case "input":
      default:
        return (
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input {...field} type={type} className={`pl-9 ${className || ""}`} placeholder={placeholder} />
          </div>
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            <RequiredIndicator />
          </FormLabel>
          <FormControl>{renderInput({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}