"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PassDialog } from "@/components/Modal/modal-PassApplicant";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import { useState } from "react";
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

interface ActionCell {
  applicant: Applicant;
  handleNotPass: (id: string) => void;
  onPassComplete: (id: string) => void;
};

const ActionsCell = ({
  applicant,
  handleNotPass,
  onPassComplete,
}: ActionCell) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmNotPass = () => {
    handleNotPass(applicant.id);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex gap-2">
      <PassDialog applicant={applicant} onPassComplete={onPassComplete} />
      <Button variant={"outline"} onClick={() => setIsDialogOpen(true)}>
        Not Pass
      </Button>
      <CustomAlertDialog
        title="Confirm, Applicant Not Pass"
        description={`Are you sure you want to mark ${applicant.name} as not passed? This action will delete the applicant and their documents and infomation.`}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmNotPass}
        confirmIcon={Trash2}
        cancelIcon={X}
      />
    </div>
  );
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
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || (!filterValue.from && !filterValue.to)) return true;
        const rowDate = new Date(row.getValue(columnId));
        const from = filterValue.from ? new Date(filterValue.from) : null;
        const to = filterValue.to ? new Date(filterValue.to) : null;
        if (from && to) {
          return rowDate >= from && rowDate <= to;
        } else if (from) {
          return rowDate >= from;
        } else if (to) {
          return rowDate <= to;
        }
        return true;
      },
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

        return (
          <div className="flex gap-2">
            <ActionsCell
              applicant={row.original}
              handleNotPass={handleNotPass}
              onPassComplete={onPassComplete}
            />
          </div>
        );
      },
    },
  ];