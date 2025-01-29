"use client";

import * as React from "react";
import { addMonths, setYear, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithPresetsProps {
  value?: string | number | Date;
  onChange?: (date: Date) => void;
  [key: string]: unknown;
}

export function DatePickerWithPresets({
  value,
  onChange,
  ...props
}: DatePickerWithPresetsProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear(),
  );

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onChange) {
      if (date) {
        onChange(date); // อัปเดตค่ากลับไปที่ React Hook Form
      }
    }
  };

  // ฟังก์ชันอัปเดตเดือนและปีเมื่อเปลี่ยน dropdown
  const updateCalendarDate = (month: number, year: number) => {
    const newDate = setYear(startOfMonth(addMonths(new Date(), month)), year);
    setSelectedDate(newDate);
  };

  // Handle การเปลี่ยนเดือน
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateCalendarDate(month, selectedYear);
  };

  // Handle การเปลี่ยนปี
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateCalendarDate(selectedMonth, year);
  };

  React.useEffect(() => {
    if (selectedDate) {
      setSelectedMonth(selectedDate.getMonth());
      setSelectedYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {selectedDate ? (
            selectedDate.toLocaleDateString("th-TH")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="flex gap-4">
          {/* Dropdown สำหรับเลือกเดือน */}
          <Select onValueChange={(value) => handleMonthChange(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 12 }).map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dropdown สำหรับเลือกปี */}
          <Select onValueChange={(value) => handleYearChange(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 65 }, (_, index) => {
                const year = new Date().getFullYear() - 18 - index; // ปี ค.ศ.
                const yearEC = year + 543;
                return (
                  <SelectItem key={yearEC} value={year.toString()}>
                    {yearEC}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Calendar
            captionLayout="dropdown"
            {...props}
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            month={new Date(selectedYear, selectedMonth)}
            onMonthChange={(date: {
              getMonth: () => React.SetStateAction<number>;
              getFullYear: () => React.SetStateAction<number>;
            }) => {
              setSelectedMonth(date.getMonth());
              setSelectedYear(date.getFullYear());
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
