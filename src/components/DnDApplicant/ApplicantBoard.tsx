"use client";

import React from "react";
import { Board } from "./Board";
import { FormApplicant } from "@/types/applicant";

interface ApplicantBoardProps {
  data: FormApplicant[];
  searchQuery?: string | null;
  selectPosition?: string | null;
}

export const ApplicantBoard = ({
  data,
  searchQuery,
  selectPosition,
}: ApplicantBoardProps) => {
  const filteredApplicants = data.filter((applicant) => {
    return (
      applicant.person.name.toLowerCase().includes(searchQuery ?? "".toLowerCase()) &&
      (selectPosition === " " || applicant.person.position === selectPosition)
    );
  });
  return (
    <div className="mt-2 flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      <Board data={filteredApplicants} />
    </div>
  );
};
