/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Board } from "./Board";

interface ApplicantBoardProps {
  data: any;
  searchQuery?: string | null;
  selectProsition?: string | null;
}

export const ApplicantBoard = ({
  data,
  searchQuery,
  selectProsition,
}: ApplicantBoardProps) => {
  const filteredApplicants = data.filter((applicant: any) => {
    return (
      applicant.person.name
        .toLowerCase()
        .includes(searchQuery ?? "".toLowerCase()) &&
      (selectProsition === " " || applicant.person.position === selectProsition)
    );
  });
  return (
    <div className="mt-2 flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      <Board data={filteredApplicants} />
    </div>
  );
};
