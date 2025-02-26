'use client'
import ApplicantTable from "@/components/Table/Applicant-table/ApplicantTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Page() {
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Probation Applicants Table</CardTitle>
          <CardDescription>Probation Applicants Table System</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicantTable />
        </CardContent>
      </Card>
    </div>
  );
}