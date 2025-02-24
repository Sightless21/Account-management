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

export default function Page() {
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
    createdAt: applicant.createdAt || "",
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
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="mr-3 flex scroll-m-20 items-center justify-between border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Probation Applicants Table
      </div>
      <div className="container mx-auto px-8 py-3">
        <DataTable
          columns={columns(handleNotPass, handlePassComplete)}
          data={simplifiedApplicants}
          searchColumn="name"
          searchPlaceholder="Search by name..."
          redirect={redirectButton}
        />
      </div>
    </div>
  );
}