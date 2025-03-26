"use client";
import ExpenseTable from "@/components/Table/Expense-table/ExpenseTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useUserRole } from "@/utils/UserRole"


export default function Page() {
  const { role } = useUserRole();
  
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Expenses Tracking</CardTitle>
          <CardDescription>Employee Expenses Tracking System</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable userRole={role} />
        </CardContent>
      </Card>
    </div>
  );
}
