import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseFormSchema, type ExpenseFormValues } from "@/schema/expenseFormSchema"

export function useExpenseFormDefault() {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      id: "",
      title: "",
      transactionDate: new Date(),
      description: "",
      status:"Pending",
      useForeignCurrency: false,
      expenses: {
        fuel: {},
        accommodation: {},
        transportation: {},
        perDiem: {},
        medicalExpenses: {},
        otherExpenses: {},
      },
      attachmentUrl: "",
      attachmentPublicId: "",
      employeeName: "",
      country: "",
    },
  })

  return {
    form,
    defaultValues: form.formState.defaultValues,
  }
}

