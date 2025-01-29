/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Board } from "./Board";


interface ApplicantBoardProps {
  data: any;
  searchQuery?: string | null
  selectProsition?: string | null
}

export const ApplicantBoard = ({ data,searchQuery, selectProsition, }: ApplicantBoardProps) => {
  
  const filteredApplicants = data.filter((applicant: any) => {
    return (
      applicant.person.name.toLowerCase().includes(searchQuery ?? "".toLowerCase()) &&
      (selectProsition === " " || applicant.person.position === selectProsition)
    );
  })
  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full mt-8 justify-center items-center">
      <Board data={filteredApplicants} />
    </div>
  );
};