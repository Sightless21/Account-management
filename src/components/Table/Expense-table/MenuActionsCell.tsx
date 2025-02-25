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
import CustomAlertDialog from "@/components/ui/customAlertDialog";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MenuActionsCell = ({ row, onEdit, onDelete, onSetSelectedExpense }: {
  row: Row<Expense>;
  onEdit?: (data: Expense) => void;
  onDelete?: (data: Expense) => void;
  onSetSelectedExpense: (expense: Expense | null) => void;
}) => {
  const [isDialogViewOpen, setIsDialogViewOpen] = useState(false);
  const [IsDialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const { title } = row.original;

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
            onClick={() => title && navigator.clipboard.writeText(title)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Title
          </DropdownMenuItem>
          <ExpenseDialog
            expense={row.original}
            onClose={() => setIsDialogViewOpen(false)}
            trigger={
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsDialogViewOpen(true); }}>
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            }
            open={isDialogViewOpen}
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
            onSelect={(e) => { e.preventDefault(); setDialogDeleteOpen(true); }}
            className="text-red-600"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete Expense
          </DropdownMenuItem>
          <CustomAlertDialog
            open={IsDialogDeleteOpen}
            onOpenChange={() => setDialogDeleteOpen(false)}
            onConfirm={() => onDelete?.(row.original)}
            title="Delete Expense"
            description="Are you sure you want to delete this expense?"
            confirmText="Delete"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};