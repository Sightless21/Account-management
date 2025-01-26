'use client'
import React, { useEffect } from "react";
import { Column } from "./Columns";
import BurnBarrel from "./BurnBarrel";
import { useApplicantStore } from "@/hooks/useApplicantStore"; // นำเข้า Zustand Store

export const Board = () => {
  const { applicants, fetchApplicants } = useApplicantStore();
  console.log("applicant : ",applicants)
  console.log("fechApplicants : ",fetchApplicants.length)  

  useEffect(() => {
    fetchApplicants(); // ดึงข้อมูลเมื่อ component โหลดครั้งแรก
}, [fetchApplicants]);

  return (
    <div className="flex gap-5 p-2 border border-red-600">
      <Column
        title="Applicant"
        column="NEW"
        headingBgColor="bg-blue-200/25 border border-blue-600"
        headingColor="text-blue-600 uppercase"
        cards={applicants}
      />
      <Column
        title="In progress interview"
        column="PENDING_INTERVIEW"
        headingBgColor="bg-yellow-200/25 border border-yellow-600"
        headingColor="text-yellow-600 uppercase"
        cards={applicants}
      />
      <Column
        title="Interview pass"
        column="INTERVIEW_PASSED"
        headingBgColor="bg-emerald-200/25 border border-emerald-600"
        headingColor="text-emerald-600 uppercase"
        cards={applicants}
      />
      <BurnBarrel />
    </div>
  );
};