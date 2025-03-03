// components/ui/currency-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: string | number;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  currencySymbol?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, placeholder, className, currencySymbol = "" ,...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    // แปลงค่าเริ่มต้นให้มีลูกน้ำเมื่อ component โหลด
    React.useEffect(() => {
      if (value !== undefined) {
        const numericValue = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
        if (!isNaN(numericValue)) {
          setDisplayValue(numericValue.toLocaleString("en-US"));
        } else {
          setDisplayValue("");
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^0-9]/g, "");
      const numericValue = inputValue ? parseInt(inputValue, 10) : 0;
      setDisplayValue(currencySymbol + numericValue.toLocaleString("th-TH"));
      if (onValueChange) onValueChange(inputValue);
    };

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("text-start", className)} // จัดขวาเพื่อให้ดูเป็นสไตล์เงิน
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";