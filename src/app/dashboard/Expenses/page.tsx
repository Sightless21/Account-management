"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import ExpenseTable from "@/components/Table/Expense-table/ExpenseTable"

//TODO : สร้างหน้า ClaimExpenses
export default function Page() {
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Leave of Absence Tracking</CardTitle>
          <CardDescription>Employee Leave of Absence Tracking System</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable userRole="HR"/>
        </CardContent>
      </Card>
    </div>
  );
}
