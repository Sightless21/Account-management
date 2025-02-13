"use client";
import React, { useState } from "react";
import Menutabs from "@/components/menutabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DayoffModal } from "@/components/Modal/modal-DayOff"
import DayOffTable from "@/components/Table/Dayoff-table/DayoffTable"
// import { useSession } from "next-auth/react";
// import { Role } from "@/types/users";


//TODO : 
export default function Page() {
  const [activeTab, setActiveTab] = useState("Leave History");
  // const {data : session , status} = useSession() //get role form session

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Employee Leave of Absence Tracking</CardTitle>
          <CardDescription>Employee Leave of Absence Tracking System</CardDescription>
          <div className="flex w-full justify-between">
            <Menutabs userRole={"ADMIN"} onTabChange={setActiveTab} />
            <DayoffModal />
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "Leave History" && <DayOffTable userRole={"HR"}/>}
          {activeTab === "Reports" && <p>แสดงข้อมูล Reports</p>}
        </CardContent>
      </Card>
    </div>
  );
}