'use client';
import React, { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useApplicantStore } from "@/hooks/useApplicantStore"; // นำเข้า Zustand Store

export default function Page() {
    const { applicants, fetchApplicants , deleteApplicant } = useApplicantStore();

    const handleNotPass = async (id: string) => {
        try {
          await deleteApplicant(id);
          alert("Applicant and related documents deleted successfully!");
        } catch (error) {
          console.error("Error deleting applicant:", error);
          alert("An error occurred while deleting the applicant and related documents.");
        }
      };

    useEffect(() => {
        fetchApplicants(); // ดึงข้อมูลเมื่อ component โหลดครั้งแรก
    }, [fetchApplicants]);

    // กรองเฉพาะ applicant ที่มี status เป็น "INTERVIEW_PASSED"
    const filteredApplicants = applicants.filter(
        (applicant) => applicant.status === "INTERVIEW_PASSED"
    );

    // แปลงข้อมูลเพื่อให้เข้ากับ DataTable
    const simplifiedApplicants = filteredApplicants.map((applicant) => ({
        id: applicant.id,
        name: applicant.person.name,
        position: applicant.person.position,
        createdAt: applicant.createdAt,
        status: applicant.status,
    }));

    return (
        <div className="flex flex-col gap-4 ml-3 mr-3">
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                Probation Applicants Table
            </div>
            <div className="container mx-auto py-3 px-8">
                <DataTable columns={columns(handleNotPass)} data={simplifiedApplicants} />
            </div>
        </div>
    );
}