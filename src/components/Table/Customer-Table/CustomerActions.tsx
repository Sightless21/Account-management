"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Customer } from "@/schema/formCustomer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Info, MoreHorizontal, Pencil, TrashIcon } from "lucide-react";
import CustomerDialogInfo from "@/components/Modal/modal-CustomerInfo";
import { CustomerDialog } from "@/components/Modal/modal-Customer";

interface CustomerActionsProps {
  row: Row<Customer>;
  deleteCustomer?: (id: string) => void;
  editCustomer?: (customer: Customer) => void;
  viewDetails?: (customer: Customer) => void;
}

export function CustomerActions({ row, deleteCustomer, editCustomer, viewDetails }: CustomerActionsProps) {
  const { companyName, id } = row.original;
  const [isModalOpenView, setIsModalOpenView] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpenView(true);
    viewDetails?.(row.original);
  };

  const handleEditClick = () => {
    setIsModalOpenEdit(true);
    editCustomer?.(row.original);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open actions menu</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(companyName)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Company Name
          </DropdownMenuItem>
          <CustomerDialogInfo
            customer={row.original}
            trigger={
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleViewDetails(); }}>
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            }
            open={isModalOpenView}
            onClose={() => setIsModalOpenView(false)}
          />
          <DropdownMenuSeparator />
          <CustomerDialog 
            customer={row.original} 
            trigger={
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEditClick(); }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Customer
              </DropdownMenuItem>
            } 
            open={isModalOpenEdit}
            onClose={() => setIsModalOpenEdit(false)}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => deleteCustomer?.(id)}
            className="text-red-600"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete Customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}