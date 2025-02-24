// src/app/dashboard/Applicant/Probation/page.tsx
"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/Table/Data-Table";
import { useApplicantData } from "@/hooks/useApplicantData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {ArrowLeft} from "lucide-react"

export default function ApplicantTable() {
  const { applicants, deleteApplicant, isLoading } = useApplicantData();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

  const simplifiedApplicants = filteredApplicants.map((applicant) => ({
    id: applicant.id || "",
    name: applicant.person.name,
    email: applicant.person.email,
    phone: applicant.person.phone,
    position: applicant.person.position,
    createdAt: applicant.createdAt ? new Date(applicant.createdAt).toISOString() : "",
    status: applicant.status,
  }));

  const redirectButton = (
    <Button
      variant="outline"
      onClick={() => router.replace("/dashboard/Applicant")}
      className="h-8"
    >
      <ArrowLeft/> Back to Applicant Board
    </Button>
  );

  return (
    <div className="space-y-4">
        <DataTable
          columns={columns(handleNotPass, handlePassComplete)}
          data={simplifiedApplicants}
          searchColumn="name"
          searchPlaceholder="Search by name..."
          redirect={redirectButton}
          dateColumn="createdAt"
        />
    </div>
  );
}