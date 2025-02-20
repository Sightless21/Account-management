// store/useExpenseUIStore.ts
import { create } from "zustand";
import { Expense } from "@/types/expense";

interface ExpenseStore {
  selectedExpense: Expense | null;
  setSelectedExpense: (expense: Expense | null) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  selectedExpense: null,
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),
}));