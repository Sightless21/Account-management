// lib/expenseUtils.ts
import { Expense } from "@/types/expense";

export function normalizeExpense(data: Partial<Expense>): Expense {
  const defaults: Expense = {
    id: "",
    title: "",
    employeeName: "",
    transactionDate: new Date().toISOString(),
    description: "",
    status: "Pending",
    attachmentUrl: "",
    attachmentPublicId: "",
    useForeignCurrency: false,
    country: "",
    expenses: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { ...defaults, ...data };
}