"use client";

import React from "react";
import { CustomerDialog } from "@/components/Modal/modal-Customer"; 

export default function Page() {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <CustomerDialog />
    </div>
  );
}