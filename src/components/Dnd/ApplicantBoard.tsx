// Main ApplicantBoard Component
"use client";
import React from "react";
import { Board } from "./Board";

export const ApplicantBoard = () => {
  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full mt-8 justify-center items-center border border-red-600">
      <Board />
      <div className="flex items-start w-full justify-start">
        <p className="text-sm text-muted-foreground">Loading ... & Saved Status</p>
      </div>
    </div>
  );
};