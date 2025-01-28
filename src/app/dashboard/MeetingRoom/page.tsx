"use client"
import React from 'react';
import { DatePickerWithRange } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker"

export default function Page() {
    const handleDateChange = (date: DateRange | undefined) => {
        if (date?.from && date.to) {
            console.log("Date from:", date.from.toISOString());
            console.log("Date to:", date.to.toISOString());
        }
    };

    return (
        <div>
            <DatePickerWithRange onDateChange={handleDateChange} />
        </div>
    );
}