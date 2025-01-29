// Main ApplicantBoard Component
"use client";
import React from "react";
import { Board } from "./Board";
import { useApplicantStore } from "@/hooks/useApplicantStore";

export const ApplicantBoard = () => {
   const { applicants, fetchApplicants } = useApplicantStore();

  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full mt-8 justify-center items-center">
      <Board data={applicants} refetch={fetchApplicants}/>
    </div>
  );
};