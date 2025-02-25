"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { CarReservationType } from "@/types/car-reservation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, Info, Copy, Pencil, TrashIcon } from "lucide-react";
import { useCarReservationUI } from "@/store/useCarreservationUIStore";
import { useDeleteCarReservation } from "@/hooks/useCarReservationData";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import { toast } from "sonner"

export function ActionsCell({ row }: { row: Row<CarReservationType> }) {
  const reservation = row.original;
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useCarReservationUI();
  const { mutateAsync: deleteCarReservation } = useDeleteCarReservation();

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="h-8 w-8 p-0">
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(reservation.employeeName)}>
            <Copy /> Copy Employee Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openModal("view", reservation)}>
            <Info /> View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openModal("edit", reservation)}>
            <Pencil /> Edit Reservation
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => {e.preventDefault() ; setIsOpen(true)}} className="text-red-500">
            <TrashIcon /> Delete Reservation
          </DropdownMenuItem>
          <CustomAlertDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            onConfirm={() => toast.promise(deleteCarReservation(reservation.id ?? ""), {
              loading: "Deleting...",
              success: "Reservation deleted successfully",
              error: "Error deleting reservation",
            })}
            title="Delete Reservation"
            description="Are you sure you want to delete this reservation?"
            confirmText="Delete"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}