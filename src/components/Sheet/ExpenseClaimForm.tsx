"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { expenseSchema, Expense } from "@/schema/expenseFormSchema";
import { normalizeExpense } from "@/lib/expenseUtils";
import { BasicInfoFields } from "@/components/Sheet/expense-form/BasicInfoFields";
import { ForeignCurrencyFields } from "@/components/Sheet/expense-form/ForeignCurrencyFields";
import { ExpenseTypeAccordion } from "@/components/Sheet/expense-form/ExpenseTypeAccordion";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenseData";
import { BadgePlus, Pencil, Loader2 } from "lucide-react";

interface ExpenseClaimFormProps {
  mode?: "create" | "edit";
  defaultValues?: Partial<Expense>;
  expenseId?: string;
  trigger?: React.ReactNode;
  onSubmitSuccess?: () => void;
}

export function ExpenseClaimForm({
  mode = "create",
  defaultValues,
  expenseId,
  trigger,
  onSubmitSuccess,
}: ExpenseClaimFormProps) {
  const { data: session } = useSession();
  const { data: user } = useUserData(session?.user.id ?? ""); // Fallback to empty string
  const [open, setOpen] = useState(false);

  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();

  // Base default values as Partial<Expense>
  const baseDefaultValues: Partial<Expense> = {
    employeeName: user ? `${user.firstName} ${user.lastName}` : "",
    expenses: {
      fuel: { liters: 0, totalCost: 0 },
      accommodation: { nights: 0, totalCost: 0 },
      transportation: { origin: "", destination: "", totalCost: 0 },
      perDiem: { amount: 0 }, // Adjusted to match schema (assuming 'days' was a typo)
      medicalExpenses: { amount: 0, description: "" },
      otherExpenses: { amount: 0, description: "" },
    },
  };

  // Merge base defaults with provided defaultValues and normalize
  const defaultFormValues = normalizeExpense({
    ...baseDefaultValues,
    ...defaultValues,
  });

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit: SubmitHandler<Expense> = async (values) => {
    try {
      if (mode === "edit" && expenseId) {
        await toast.promise(
          updateExpenseMutation.mutateAsync({ id: expenseId, data: values }),
          {
            loading: "Updating expense claim...",
            success: "Expense claim updated successfully!",
            error: (err) => `Error updating expense claim: ${err.message || "Unknown error"}`,
          }
        );
      } else {
        await toast.promise(
          createExpenseMutation.mutateAsync(values),
          {
            loading: "Creating expense claim...",
            success: "Expense claim created successfully!",
            error: (err) => `Error creating expense claim: ${err.message || "Unknown error"}`,
          }
        );
      }

      form.reset(defaultFormValues); // Reset form to initial state
      setOpen(false);
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  const isPending = createExpenseMutation.isPending || updateExpenseMutation.isPending;

  const defaultTrigger = mode === "create" ? (
    <Button variant="default" className="h-8">
      <BadgePlus className="mr-2" /> Add Expense Claim
    </Button>
  ) : (
    <Button variant="outline" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="!max-w-[700px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "edit" ? "Edit" : "Add"} Expense Claim</SheetTitle>
          <SheetDescription>Fill in the details of your expense claim.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoFields control={form.control} />
            <ForeignCurrencyFields control={form.control} />
            <ExpenseTypeAccordion control={form.control} />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Submitting..."}
                </>
              ) : (
                mode === "edit" ? "Update Expense Claim" : "Submit Expense Claim"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}