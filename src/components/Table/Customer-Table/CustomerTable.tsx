"use client";

import React from "react";
import { DataTable } from "@/components/Table/Data-Table";
import { getColumns } from "./columns";
import { useCustomer, useDeleteCustomer } from "@/hooks/useCustomerData";
import { Customer } from "@/schema/formCustomer";
import { CustomerDialog } from "@/components/Modal/modal-Customer";

export default function CustomerTable() {
  const { data: customers } = useCustomer();
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer);
  };

  const handleViewDetails = (customer: Customer) => {
    console.log("Viewing details for:", customer);
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
        defaultVisibleColumns={["companyName", "contactPerson", "position", "phoneNumber", "actions"]}
      />
    </div>
  );
}