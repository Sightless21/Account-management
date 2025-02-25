"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ExpenseTable from "@/components/Table/Expense-table/ExpenseTable"

//DONE : สร้างหน้า ClaimExpenses
export default function Page() {
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Expenses Tracking</CardTitle>
          <CardDescription>Employee Expenses Tracking System</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable userRole="HR" />
        </CardContent>
      </Card>
    </div>
  );
}
