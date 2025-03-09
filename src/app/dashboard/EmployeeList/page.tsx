"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import EmployeesTable from "@/components/Table/Employee-Table/EmployeeTable"
import {useUserRole} from "@/utils/UserRole"

export default function Page() {
  const { role } = useUserRole();
 
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee list List</CardTitle>
          <CardDescription>Employee list List System</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesTable userRole={role} />
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
}