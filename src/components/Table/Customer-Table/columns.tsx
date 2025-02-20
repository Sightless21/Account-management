/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/schema/formCustomer";
import { DataTableColumnHeader } from "@/components/Table/ColumnHeader";
import { CustomerActions } from "@/components/Table/Customer-Table/CustomerActions"
import { CustomColumnMeta } from "@/types/table"; // Adjust import path
import { Badge } from "@/components/ui/badge";

interface ColumnHandlers {
  deleteCustomer?: (id: string) => void;
  editCustomer?: (customer: Customer) => void;
  viewDetails?: (customer: Customer) => void;
}

export const getColumns = (handlers: ColumnHandlers = {}): ColumnDef<Customer, any>[] => [
  {
    id: "companyName",
    accessorKey: "companyName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company Name" />,
    meta: { title: "Company Name" } as CustomColumnMeta<Customer, any>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <p>{row.original.companyName}</p>
        <Badge variant={"outline"}>{row.original.industry}</Badge>
      </div>
    ),
  },
  {
    id:"contactPerson",
    accessorKey: "contactPerson",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact Person" />,
    meta: { title: "Contact Person" } as CustomColumnMeta<Customer, any>,
  },
  {
    id:"position",
    accessorKey: "position",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
    meta: { title: "Position" } as CustomColumnMeta<Customer, any>,
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
    meta: { title: "Phone Number" } as CustomColumnMeta<Customer, any>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CustomerActions
        row={row}
        deleteCustomer={handlers.deleteCustomer}
        editCustomer={handlers.editCustomer}
        viewDetails={handlers.viewDetails}
      />
    ),
    meta: { title: "Actions" } as CustomColumnMeta<Customer, any>,
  },
];