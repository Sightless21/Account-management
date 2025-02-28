'use client'
import React from "react";
import {ApplicantBoard} from "@/components/ApplicantBoard"
import { useApplicantData , useUpdateApplicantStatus , useDeleteApplicant } from "@/hooks/useApplicantData";

export default function Page() {
  const { data: applicants } = useApplicantData();
  const { mutate: updateApplicantStatus }= useUpdateApplicantStatus();
  const { mutate: deleteApplicant }= useDeleteApplicant();


  return (
   <div>
    <ApplicantBoard data={applicants || []} onUpdateStatus={updateApplicantStatus} onDelete={deleteApplicant} />
   </div> 
  );
}