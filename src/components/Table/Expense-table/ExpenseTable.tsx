'use client'

import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/Data-Table";
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm";
import { useExpenseStore } from "@/store/useExpenenseUIStore";
import { Expense } from "@/schema/expenseFormSchema"
import { toast } from "sonner";
import { useExpenses, useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenseData";

interface ExpenseTableProps {
  userRole: string;
}

export default function ExpenseTable({ userRole }: ExpenseTableProps) {
  const { data: expensesData, isLoading, error } = useExpenses();
  const { mutateAsync: updateExpenseMutation } = useUpdateExpense();
  const { mutateAsync: deleteExpenseMutation } = useDeleteExpense();
  const setSelectedExpense = useExpenseStore((state) => state.setSelectedExpense);

  if (isLoading) return <p>Loading expenses...</p>;
  if (error) return <p>Error loading expenses: {error instanceof Error ? error.message : "Unknown error"}</p>;

  const handleDelete = (expense: Expense) => {
    toast.promise(deleteExpenseMutation({ id: expense.id }), {
      loading: "Deleting expense...",
      success: "Expense deleted successfully!",
      error: (err) => `Error deleting expense: ${err.message || "Unknown error"}`,
    });
  };

  const handleAccepted = (expense: Expense) => {
    toast.promise(
      updateExpenseMutation({ id: expense.id, data: { status: "Accepted" } }),
      {
        loading: "Updating expense...",
        success: "Expense approved successfully!",
        error: (err) => `Error approving expense: ${err.message || "Unknown error"}`,
      }
    );
  };

  const handleDeclined = (expense: Expense) => {
    toast.promise(
      updateExpenseMutation({ id: expense.id, data: { status: "Declined" } }),
      {
        loading: "Updating expense...",
        success: "Expense declined successfully!",
        error: (err) => `Error declining expense: ${err.message || "Unknown error"}`,
      }
    );
  };

  const handleReset = (expense: Expense) => {
    toast.promise(
      updateExpenseMutation({ id: expense.id, data: { status: "Pending" } }),
      {
        loading: "Resetting expense...",
        success: "Expense reset to pending successfully!",
        error: (err) => `Error resetting expense: ${err.message || "Unknown error"}`,
      }
    );
  };

  const columns = getColumns(userRole, {
    onDelete: handleDelete,
    onApprove: handleAccepted,
    onReject: handleDeclined,
    onReset: handleReset,
    onSetSelectedExpense: setSelectedExpense,
  });

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={expensesData ?? []}
        searchColumn="Title"
        searchPlaceholder="Search expenses title..."
        dateColumn="transactionDate"
        statusColumn="status"
        defaultVisibleColumns={["Title", "Total", "transactionDate", "status", 'menu-actions']}
        statusOptions={[
          { label: "Pending", value: "Pending" },
          { label: "Accepted", value: "Accepted" },
          { label: "Declined", value: "Declined" },
        ]}
        toolbarAdditionalControls={<ExpenseClaimForm />}
      />
    </div>
  );
}