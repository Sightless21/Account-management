"use client";
import ExpenseTable from "@/components/Table/Expense-table/ExpenseTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

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
