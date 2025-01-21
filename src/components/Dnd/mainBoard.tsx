// Main ApplicantBoard Component
"use client";
import React from "react";
import { Board } from "./Board";

export const ApplicantBoard = () => {
  return (
    <div>
      <Board />
      <p className="text-sm text-muted-foreground">Loading ... & Saved Status</p>
    </div>
  );
};