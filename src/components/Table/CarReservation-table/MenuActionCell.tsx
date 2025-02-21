"use client";

import { Row } from "@tanstack/react-table";
import { CarReservationType } from "@/types/car-reservation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, Info, Copy, Pencil, TrashIcon } from "lucide-react";
import { useCarReservationUI } from "@/store/useCarreservationUIStore";

export function ActionsCell({ row }: { row: Row<CarReservationType> }) {
  const reservation = row.original;
  const { openModal } = useCarReservationUI();

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
          <DropdownMenuItem onClick={() => {}} className="text-red-500">
            <TrashIcon /> Delete Reservation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}