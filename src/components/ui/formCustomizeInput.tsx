/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { type Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Muted } from "@/components/ui/typography";
import { DatePickerWithPresets } from "@/components/date-picker";
import { CurrencyInput } from "@/components/ui/currency-input";

interface FormInputProps {
  name: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  placeholder?: string;
  control?: Control<any>;
  type?: string;
  component?: "input" | "textarea" | "phone" | "radio" | "checkbox" | "birthdate" | "currency";
  required?: boolean;
  className?: string;
  options?: { label: string; value: string; description?: string }[];
}

export function FormInput({
  name,
  label,
  description,
  icon: Icon,
  placeholder,
  control,
  type,
  component = "input",
  required,
  className,
  options,
}: FormInputProps) {
  const RequiredIndicator = () => (required ? <span className="text-destructive ml-2">*</span> : null);

  const renderInput = ({ field }: { field: any }) => {
    switch (component) {
      case "textarea":
        return (
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
            <Textarea {...field} className={`pl-9 ${className || ""}`} placeholder={placeholder} />
          </div>
        );
      case "phone":
        return (
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
            <PhoneInput {...field} className={`pl-9 ${className || ""}`} placeholder={placeholder} />
          </div>
        );
      case "birthdate":
        return (
          <div className="relative">
            <DatePickerWithPresets
              value={field.value}
              onChange={field.onChange}
            />
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            {...field}
            onValueChange={field.onChange}
            value={field.value}
            className={className}
          >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className={className}>
            {options?.map((option) => (
              <div key={option.value} className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...(field.value || []), option.value]);
                      } else {
                        field.onChange(field.value.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
                    <Muted>{option.description}</Muted>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        );
      case "currency":
        return (
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
            <CurrencyInput
              currencySymbol="THB"
              {...field}
              className={`pl-9 ${className || ""}`}
              placeholder={placeholder}
            />
          </div>
        );
      case "input":
      default:
        return (
          <div className="relative">
            {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
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
            {description && <Muted>{description}</Muted>}
          </FormLabel>
          <FormControl>{renderInput({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}