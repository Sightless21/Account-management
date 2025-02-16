"use client"

import { useState } from "react"
import { Control, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Form } from "@/components/ui/form"
import { expenseFormSchema, ExpenseFormValues } from "@/schema/expenseFormSchema"
import { useExpenseForm } from "@/hooks/useExpenseForm"
import { BasicInfoFields } from "@/components/Sheet/expense-form/BasicInfoFields"
import { ForeignCurrencyFields } from "@/components/Sheet/expense-form/ForeignCurrencyFields"
import { ExpenseTypeAccordion } from "@/components/Sheet/expense-form/ExpenseTypeAccordion"

export function ExpenseClaimForm() {
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: useExpenseForm().defaultValues,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmit(values: any) {
    console.log(values)
    // Handle form submission
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add Expense Claim</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Expense Claim</SheetTitle>
          <SheetDescription>Fill in the details of your expense claim.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoFields control={form.control as Control<ExpenseFormValues>} />
            <ForeignCurrencyFields control={form.control as Control<ExpenseFormValues>} />
            <ExpenseTypeAccordion control={form.control as Control<ExpenseFormValues>} />
            <Button type="submit">Submit Expense Claim</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

