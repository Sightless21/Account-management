"use client";
import React, { useState } from "react";
import Menutabs from "@/components/menutabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DayoffModal } from "@/components/Modal/modal-DayOff"
import { LeaveTable } from "@/components/Table/leave-table"


//TODO : 
export default function Page() {
  const [activeTab, setActiveTab] = useState("My Leave");

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Leave of Absence Tracking</CardTitle>
          <CardDescription>Employee Leave of Absence Tracking System</CardDescription>
          <div className="flex gap-12">
            <Menutabs userRole={"manager"} onTabChange={setActiveTab} />
            <DayoffModal />
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "My Leave" && <LeaveTable userRole={"MANAGER"} />}
          {activeTab === "Requests" && <p>แสดงข้อมูล Requests</p>}
          {activeTab === "Reports" && <p>แสดงข้อมูล Reports</p>}
        </CardContent>
      </Card>
    </div>
  );
}
