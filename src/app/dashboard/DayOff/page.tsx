"use client";
import React, { useState } from "react";
import Menutabs from "@/components/menutabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import DayOffTable from "@/components/Table/Dayoff-table/DayoffTable"



//TODO : Reports Dayoff MANAGER , HR interface 
export default function Page() {
  const [activeTab, setActiveTab] = useState("Leave History");

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Day off of Absence Tracking</CardTitle>
          <CardDescription>Employee Day off of Absence Tracking System</CardDescription>
          <div className="flex w-full justify-between">
            <Menutabs userRole={"ADMIN"} onTabChange={setActiveTab} />
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "Leave History" && <DayOffTable userRole={"ADMIN"}/>}
          {activeTab === "Reports" && <p>แสดงข้อมูล Reports</p>}
        </CardContent>
      </Card>
    </div>
  );
}