import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseFormSchema, type ExpenseFormValues } from "@/schema/expenseFormSchema"

export function useExpenseForm() {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      useForeignCurrency: false,
      expenses: {
        fuel: {},
        accommodation: {},
        transportation: {},
        perDiem: {},
        medicalExpenses: {},
        otherExpenses: {},
      },
    },
  })

  return {
    form,
    defaultValues: form.formState.defaultValues,
  }
}

