import { Expense, expenseSchema } from "@/schema/expenseFormSchema";

export function normalizeExpense(partialExpense: Partial<Expense>): Expense {
  const base: Expense = {
    id: "",
    title: "Default Title", // Satisfies min(2)
    employeeName: "",
    transactionDate: new Date().toISOString(),
    description: "Default description text", // Satisfies min(10)
    status: "Pending",
    attachmentUrl: "",
    attachmentPublicId: "",
    useForeignCurrency: false,
    country: "",
    expenses: {
      fuel: undefined,
      accommodation: undefined,
      transportation: undefined,
      perDiem: undefined,
      medicalExpenses: undefined,
      otherExpenses: undefined,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const merged = { ...base, ...partialExpense };

  if (partialExpense.expenses) {
    merged.expenses = {
      fuel: partialExpense.expenses.fuel
        ? {
            liters: partialExpense.expenses.fuel.liters ?? 0,
            totalCost: partialExpense.expenses.fuel.totalCost ?? 0,
          }
        : undefined,
      accommodation: partialExpense.expenses.accommodation
        ? {
            nights: partialExpense.expenses.accommodation.nights ?? 0,
            totalCost: partialExpense.expenses.accommodation.totalCost ?? 0,
          }
        : undefined,
      transportation: partialExpense.expenses.transportation
        ? {
            origin: partialExpense.expenses.transportation.origin ?? "",
            destination: partialExpense.expenses.transportation.destination ?? "",
            totalCost: partialExpense.expenses.transportation.totalCost ?? 0,
          }
        : undefined,
      perDiem: partialExpense.expenses.perDiem
        ? {
            amount: partialExpense.expenses.perDiem.amount ?? 0,
          }
        : undefined,
      medicalExpenses: partialExpense.expenses.medicalExpenses
        ? {
            amount: partialExpense.expenses.medicalExpenses.amount ?? 0,
            description: partialExpense.expenses.medicalExpenses.description ?? "",
          }
        : undefined,
      otherExpenses: partialExpense.expenses.otherExpenses
        ? {
            amount: partialExpense.expenses.otherExpenses.amount ?? 0,
            description: partialExpense.expenses.otherExpenses.description ?? "",
          }
        : undefined,
    };
  }

  return expenseSchema.parse(merged);
}