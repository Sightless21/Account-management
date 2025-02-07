"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Applicant = {
  id: string;
  name: string;
  position: string;
  createdAt: string;
  status: string;
};

//FIXME : Applocant type move to Type Folder
export const columns = (
  handleNotPass: (id: string) => void,
): ColumnDef<{
  id: string | undefined;
  name: string;
  position: string;
  createdAt: string | undefined;
  status: string;
}>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
      const applicant = row.original; // ข้อมูลผู้สมัครในแถวปัจจุบัน
      return (
        <div className="flex gap-2">
          <Button variant={"default"} onClick={() => {}}>
            Pass
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => applicant.id && handleNotPass(applicant.id)} // ส่ง id ไปยัง handleNotPass
          >
            Not Pass
          </Button>
        </div>
      );
    },
  },
];
