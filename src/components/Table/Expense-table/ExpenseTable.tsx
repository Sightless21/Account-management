'use client'

import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/Data-Table";
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm";
import { useExpenseStore } from "@/store/useExpenenseUIStore";
import { Expense } from "@/schema/expenseFormSchema";
import { toast } from "sonner";
import { useExpenses, useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenseData";
import axios from "axios";

interface ExpenseTableProps {
  userRole: string;
}

export default function ExpenseTable({ userRole }: ExpenseTableProps) {
  const { data: expensesData, isLoading, error } = useExpenses();
  const { mutateAsync: updateExpenseMutation } = useUpdateExpense();
  const { mutateAsync: deleteExpenseMutation } = useDeleteExpense();
  const setSelectedExpense = useExpenseStore((state) => state.setSelectedExpense);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ THB: 1, JPY: 0.25 });
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setIsRatesLoading(true);
      const cached = localStorage.getItem("exchangeRates");
      let rates: Record<string, number> = { THB: 1, JPY: 0.25 };

      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (
            data &&
            typeof data === "object" &&
            data.THB === 1 &&
            typeof data.JPY === "number" &&
            Date.now() - timestamp < 24 * 60 * 60 * 1000
          ) {
            console.log("Using cached exchange rates:", data);
            rates = data;
            setExchangeRates(rates);
            setIsRatesLoading(false);
            return;
          } else {
            console.log("Invalid or expired cache, fetching new rates");
            localStorage.removeItem("exchangeRates");
          }
        } catch (err) {
          console.error("Error parsing cached exchange rates:", err);
          localStorage.removeItem("exchangeRates");
        }
      }

      const urls = [
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/thb.json",
        "https://latest.currency-api.pages.dev/v1/currencies/thb.json",
      ];
      for (const url of urls) {
        try {
          const response = await axios.get(url);
          console.log("API response:", response.data);
          const apiRates = response.data.thb;
          if (!apiRates || typeof apiRates !== "object") {
            throw new Error("Invalid exchange rates in API response");
          }
          rates = apiRates;
          setExchangeRates(rates);
          localStorage.setItem("exchangeRates", JSON.stringify({ data: rates, timestamp: Date.now() }));
          setIsRatesLoading(false);
          // console.log("Set exchange rates:", rates);
          // console.log("JPY rate:", rates.jpy); 
          return;
        } catch (err) {
          console.error(`Error fetching from ${url}:`, err);
        }
      }

      // console.error("All API endpoints failed, using fallback rates");
      setExchangeRates(rates);
      setIsRatesLoading(false);
      // console.log("Set exchange rates (fallback):", rates);
      // console.log("JPY rate (fallback):", rates.JPY);
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (expensesData) {
      console.log("Expenses data:", expensesData);
    }
  }, [expensesData]);

  if (isLoading || isRatesLoading) return <p>Loading expenses...</p>;
  if (error) return <p>Error loading expenses: {error instanceof Error ? error.message : "Unknown error"}</p>;

  const handleDelete = (expense: Expense | null) => {
    if (!expense) return;
    toast.promise(deleteExpenseMutation({ id: expense.id }), {
      loading: "Deleting expense...",
      success: "Expense deleted successfully!",
      error: (err) => `Error deleting expense: ${err.message || "Unknown error"}`,
    });
  };

  const handleAccepted = (expense: Expense | null) => {
    if (!expense) return;
    toast.promise(
      updateExpenseMutation({ id: expense.id, data: { status: "Accepted" } }),
      {
        loading: "Updating expense...",
        success: "Expense approved successfully!",
        error: (err) => `Error approving expense: ${err.message || "Unknown error"}`,
      }
    );
  };

  const handleDeclined = (expense: Expense | null) => {
    if (!expense) return;
    toast.promise(
      updateExpenseMutation({ id: expense.id, data: { status: "Declined" } }),
      {
        loading: "Updating expense...",
        success: "Expense declined successfully!",
        error: (err) => `Error declining expense: ${err.message || "Unknown error"}`,
      }
    );
  };

  const handleReset = (expense: Expense | null) => {
    if (!expense) return;
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
  }, exchangeRates);

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