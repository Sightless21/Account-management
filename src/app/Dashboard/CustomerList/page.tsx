"use client";

import CustomerTable from "@/components/Table/Customer-Table/CustomerTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Page() {

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Customer List System</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable />
        </CardContent>
      </Card>
    </div>
  );
}