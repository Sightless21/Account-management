"use client";
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { LucideIcon } from "lucide-react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: LucideIcon;
  cancelIcon?: LucideIcon;
  confirmVariant?: ButtonProps["variant"]; 
  cancelVariant?: ButtonProps["variant"];
  confirmClassName?: string; 
  cancelClassName?: string; 
}

export default function CustomAlertDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Alert",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmIcon: ConfirmIcon,
  cancelIcon: CancelIcon,
  confirmVariant = "default",
  cancelVariant = "outline", 
  confirmClassName = "bg-red-600 hover:bg-red-700 text-white",
  cancelClassName = "text-black hover:bg-gray-100",
}: AlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button
              variant={cancelVariant}
              className={`flex items-center gap-2 ${cancelClassName}`}
            >
              {CancelIcon && <CancelIcon className="h-4 w-4" />}
              <span>{cancelText}</span>
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button
              variant={confirmVariant}
              className={`flex items-center gap-2 ${confirmClassName}`}
            >
              {ConfirmIcon && <ConfirmIcon className="h-4 w-4" />}
              <span>{confirmText}</span>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}