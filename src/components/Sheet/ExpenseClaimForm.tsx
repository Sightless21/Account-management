"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { expenseFormSchema, ExpenseFormValues } from "@/schema/expenseFormSchema"
import { useExpenseFormDefault } from "@/hooks/useExpenseFormDefault"
import { BasicInfoFields } from "@/components/Sheet/expense-form/BasicInfoFields"
import { ForeignCurrencyFields } from "@/components/Sheet/expense-form/ForeignCurrencyFields"
import { ExpenseTypeAccordion } from "@/components/Sheet/expense-form/ExpenseTypeAccordion"
import { handleExpense } from "@/app/action/expense"
import { useUserData } from "@/hooks/useUserData"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useExpenses } from "@/hooks/useExpenseData"

export function ExpenseClaimForm() {
  const { refetch } = useExpenses();
  const { data: session } = useSession()
  const { data: user } = useUserData(session?.user.id as string)
  const userinfo = user
  const [open, setOpen] = useState(false)
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      ...useExpenseFormDefault().defaultValues,
      employeename: userinfo ? `${userinfo.firstName} ${userinfo.lastName}` : "",
    },
  })

  const onSubmit: SubmitHandler<ExpenseFormValues> = async (values) => {
    console.log("This is values form sheet:",values)
    await toast.promise(handleExpense(values),{
      loading: 'Loading...',
      success: 'create new expense claim successfully',
      error: 'Error to create new expense claim!'
    });

    await refetch();
    // Handle form submission
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add Expense Claim</Button>
      </SheetTrigger>
      <SheetContent className="!max-w-[700px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Expense Claim</SheetTitle>
          <SheetDescription>Fill in the details of your expense claim.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoFields control={form.control} />
            <ForeignCurrencyFields control={form.control} />
            <ExpenseTypeAccordion control={form.control} />
            <Button type="submit">Submit Expense Claim</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}