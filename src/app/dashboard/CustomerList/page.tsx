"use client";
import { CustomerDialog } from "@/components/Modal/modal-Customer";
import { CustomerFormData } from "@/schema/formCustomer";
import React from "react";

//TODO : สร้างหน้า CustomerList
export default function Page() {
  const handleSubmit = (data: CustomerFormData) => {
    console.log(data)
    // Handle form submission here
  }

  return (
    <div>
      <CustomerDialog onSubmit={handleSubmit} />
    </div>
  );
}
