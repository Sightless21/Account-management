// EmployeeActions.tsx
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Employee } from "@/types/employee";
import { Row } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Trash2, TrashIcon, X } from "lucide-react";
import { useState } from "react";

interface EmployeeActionsProps {
  row: Row<Employee>;
  onDelete: () => void;
}

export function EmployeeActions({ row, onDelete }: EmployeeActionsProps) {
  const { person } = row.original;
  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(person.name)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Employee Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsOpenDialogDelete(true);
            }}
            className="text-red-600"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete Employee
          </DropdownMenuItem>
          <CustomAlertDialog
            open={isOpenDialogDelete}
            onOpenChange={setIsOpenDialogDelete}
            title="Delete Employee"
            description={`Are you sure you want to delete ${person.name}?`}
            onConfirm={onDelete}
            confirmText="Delete"
            cancelText="Cancel"
            confirmIcon={Trash2}
            cancelIcon={X}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}