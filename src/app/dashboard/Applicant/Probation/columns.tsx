"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {PassDialog} from "../../../../components/Modal/modal-PassApplicant"
export type Applicant = {
  id: string;
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
};

export const columns = (
  handleNotPass: (id: string) => void,
  onPassComplete: (id: string) => void,
): ColumnDef<Applicant>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Position
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Last Applied",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const applicant = row.original;

      console.log("Applicant:", applicant);
      return (
        <div className="flex gap-2">
          <PassDialog applicant={applicant} onPassComplete={onPassComplete} />
          <Button
            variant="secondary"
            onClick={() => handleNotPass(applicant.id)}
          >
            Not Pass
          </Button>
        </div>
      );
    },
  },
];