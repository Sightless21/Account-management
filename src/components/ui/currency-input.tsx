// components/ui/currency-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: number;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  currencySymbol?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, onValueChange, placeholder, className, currencySymbol = "", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    React.useEffect(() => {
      const numericValue = typeof value === "number" && !isNaN(value) ? value : 0;
      setDisplayValue(`${currencySymbol} ${numericValue.toLocaleString("th-TH")}`);
    }, [value, currencySymbol]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^0-9]/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
      const numericValue = inputValue ? parseFloat(inputValue) : 0; // แปลงเป็น number

      setDisplayValue(`${currencySymbol} ${numericValue.toLocaleString("th-TH")}`);
      if (onValueChange) onValueChange(numericValue); // ส่ง number
    };

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("text-start", className)}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";