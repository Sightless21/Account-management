"use client";

import React from "react";
import { DataTable } from "@/components/Table/Data-Table"; // Adjust import path
import { getColumns } from "./columns"; // Adjust path
import { useCustomer, useDeleteCustomer, useUpdateCustomer } from "@/hooks/useCustomerData";
import { Customer } from "@/schema/formCustomer";
import { CustomerDialog } from "@/components/Modal/modal-Customer";


export default function CustomerTable() {
  const { data: customers } = useCustomer()
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer();

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer);
    // Add your edit logic here (e.g., open a dialog)
  };

  const handleViewDetails = (customer: Customer) => {
    console.log("Viewing details for:", customer);
    // Add your view details logic here (e.g., open a dialog)
  };

  const columns = getColumns({
    deleteCustomer,
    editCustomer: handleEditCustomer,
    viewDetails: handleViewDetails,
  });

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={customers ?? []}
        searchColumn="companyName"
        searchPlaceholder="Search by company name"
        toolbarAdditionalControls={<CustomerDialog />}
        defaultVisibleColumns={["companyName", "contactPerson", "position", "phoneNumber", "email", "actions"]}
      />
    </div>
  );
}