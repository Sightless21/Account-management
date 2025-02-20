"use client";

import React from "react";
import { CustomerDialog } from "@/components/Modal/modal-Customer"; 
import { CustomerFormData } from "@/schema/formCustomer";

export default function Page() {
  const handleSubmit = (data: CustomerFormData) => {
    console.log("Form submitted with data:", data);
    // Handle form submission (e.g., API call)
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <CustomerDialog onSubmit={handleSubmit} />
    </div>
  );
}