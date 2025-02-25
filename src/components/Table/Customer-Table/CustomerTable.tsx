"use client";

import React from "react";
import { DataTable } from "@/components/Table/Data-Table";
import { getColumns } from "./columns";
import { useCustomer, useDeleteCustomer } from "@/hooks/useCustomerData";
import { Customer } from "@/schema/formCustomer";
import { CustomerDialog } from "@/components/Modal/modal-Customer";
import { toast } from "sonner";

//DONE : Customer Table
export default function CustomerTable() {
  const { data: customers } = useCustomer();
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();

  const handleEditCustomer = (customer: Customer) => {
    console.log("Editing customer:", customer);
  };

  const handleViewDetails = (customer: Customer) => {
    console.log("Viewing details for:", customer);
  };

  const handdleDeleteCustomer = (id: string) => {
    toast.promise(deleteCustomer(id),{
      loading: "Deleting customer...",
      success: "Customer deleted successfully",
      error: "Error deleting customer",
    });
  };

  const columns = getColumns({
    deleteCustomer : handdleDeleteCustomer ,
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