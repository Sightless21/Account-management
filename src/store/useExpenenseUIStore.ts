import { create } from 'zustand'
import { ExpenseFormValues } from "@/schema/expenseFormSchema"

interface ExpenseStore {
  selectedExpense: ExpenseFormValues | null
  setSelectedExpense: (expense: ExpenseFormValues | null) => void
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  selectedExpense: null,
  setSelectedExpense: (expense) => set({ selectedExpense: expense })
}))