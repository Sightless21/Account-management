'use client'
import React from 'react';
import DashboardItem from "@/components/Dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function Page() {
  return (
    <Card className="mr-3 flex flex-col gap-4 p-4 h-full">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Overview of your website</CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardItem />
      </CardContent>
    </Card>
  );
}