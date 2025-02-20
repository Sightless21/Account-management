// MenuActionsCell.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Copy, Info, MoreHorizontal, Pencil, TrashIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm";
import { ExpenseDialog } from "@/components/Modal/modal-Expenses";
import { Expense } from "@/schema/expenseFormSchema"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MenuActionsCell = ({ row, onEdit, onDelete, onSetSelectedExpense }: {
  row: Row<Expense>;
  onEdit?: (data: Expense) => void;
  onDelete?: (data: Expense) => void;
  onSetSelectedExpense: (expense: Expense | null) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { employeeName } = row.original;

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
          <DropdownMenuItem
            onClick={() => employeeName && navigator.clipboard.writeText(employeeName)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Employee Name
          </DropdownMenuItem>
          <ExpenseDialog
            expense={row.original}
            onClose={() => setIsDialogOpen(false)}
            trigger={
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsDialogOpen(true); }}>
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            }
            open={isDialogOpen}
          />
          <DropdownMenuSeparator />
          <ExpenseClaimForm
            mode="edit"
            defaultValues={row.original}
            expenseId={row.original.id}
            onSubmitSuccess={() => onEdit?.(row.original)}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Expense
              </DropdownMenuItem>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete?.(row.original)}
            className="text-red-600"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete Expense
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};