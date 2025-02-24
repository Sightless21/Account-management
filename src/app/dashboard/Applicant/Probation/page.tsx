"use client";
import React from "react";
import { columns} from "./columns";
import { DataTable } from "./data-table";
import { useApplicantData } from "@/hooks/useApplicantData";
import { toast } from "sonner";

export default function Page() {
  const { applicants, deleteApplicant } = useApplicantData();

  const handleNotPass = async (id: string) => {
    try {
      await toast.promise(deleteApplicant(id), {
        loading: "Deleting applicant...",
        success: "Applicant deleted successfully!",
        error: "Error deleting applicant",
      });
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast.error("An error occurred while deleting the applicant.");
    }
  };

  const handlePassComplete = async () => {
    try {
      toast.success("Applicant passed successfully!");
    } catch (error) {
      console.error("Error in pass completion:", error);
      toast.error("An error occurred while updating the applicant.");
    }
  };

  const filteredApplicants = applicants.filter(
    (applicant) => applicant.status === "INTERVIEW_PASSED"
  );

  // แปลงข้อมูลเพื่อให้เข้ากับ DataTable
  const simplifiedApplicants = filteredApplicants.map((applicant) => ({
    id: applicant.id || "",
    name: applicant.person.name,
    email: applicant.person.email,
    phone: applicant.person.phone,
    position: applicant.person.position,
    createdAt: applicant.createdAt || "",
    status: applicant.status,
  }));

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="mr-3 flex scroll-m-20 items-center justify-between border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Probation Applicants Table
      </div>
      <div className="container mx-auto px-8 py-3">
        <DataTable
          columns={columns(handleNotPass, handlePassComplete)}
          data={simplifiedApplicants}
        />
      </div>
    </div>
  );
}