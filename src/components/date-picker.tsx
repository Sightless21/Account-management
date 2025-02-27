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
  value?: string | number | Date; // ค่าจาก React Hook Form
  onChange?: (date: Date) => void; // อัปเดตค่าไปยัง React Hook Form
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
    value ? new Date(value).getMonth() : new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    value ? new Date(value).getFullYear() : new Date().getFullYear(),
  );

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
      if (onChange) {
        onChange(date); // อัปเดตค่าไปยัง React Hook Form
      }
    }
  };

  const toBuddhistYear = (year: number) => year + 543;
  const fromBuddhistYear = (year: number) => year - 543;

  const updateCalendarDate = (month: number, year: number) => {
    const newDate = setYear(startOfMonth(new Date(year, month)), year);
    setSelectedDate(newDate);
    setSelectedMonth(month);
    setSelectedYear(year);
    if (onChange) {
      onChange(newDate); // อัปเดตเมื่อเปลี่ยนเดือนหรือปี
    }
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateCalendarDate(month, selectedYear);
  };

  const handleYearChange = (year: number) => {
    const christianYear = fromBuddhistYear(year);
    setSelectedYear(christianYear);
    updateCalendarDate(selectedMonth, christianYear);
  };

  // Sync ค่าจาก props (React Hook Form) เข้ากับ state ภายใน
  React.useEffect(() => {
    if (value && (!selectedDate || new Date(value).getTime() !== selectedDate.getTime())) {
      const newDate = new Date(value);
      setSelectedDate(newDate);
      setSelectedMonth(newDate.getMonth());
      setSelectedYear(newDate.getFullYear());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
            selectedDate.toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          ) : (
            <span>เลือกวันที่</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="flex gap-4">
          <Select onValueChange={(value) => handleMonthChange(parseInt(value))}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedDate
                    ? selectedDate.toLocaleString("th-TH", { month: "long" })
                    : "เดือน"
                }
              />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 12 }).map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {new Date(0, index).toLocaleString("th-TH", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleYearChange(parseInt(value))}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedDate
                    ? toBuddhistYear(selectedDate.getFullYear()).toString()
                    : "ปี"
                }
              />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: 65 }, (_, index) => {
                const yearCE = new Date().getFullYear() - 18 - index;
                const yearBE = toBuddhistYear(yearCE);
                return (
                  <SelectItem key={yearBE} value={yearBE.toString()}>
                    {yearBE}
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