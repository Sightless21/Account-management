"use client";

import Menutabs from "@/components/menutabs";
import DayOffTable from "@/components/Table/Dayoff-table/DayoffTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOffTabsConfig } from "@/configs/tabsConfig";
import React, { useState } from "react";
import { useUserRole } from "@/utils/UserRole"

export default function Page() {
  const [activeTab, setActiveTab] = useState("Leave History");
  const { role } = useUserRole();

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Day off of Absence Tracking</CardTitle>
          <CardDescription>Employee Day off of Absence Tracking System</CardDescription>
          <div className="flex w-full justify-between">
            <Menutabs
              userRole={role}
              tabsConfig={DayOffTabsConfig}
              onTabChange={setActiveTab}
              defaultTab="Leave History"
            />
          </div>
        </CardHeader>
        <CardContent className="mx-auto space-y-4">
          {activeTab === "Leave History" && <DayOffTable userRole={role} />}
          {activeTab === "Reports" && <p>แสดงข้อมูล Reports</p>}
        </CardContent>
      </Card>
    </div>
  );
}