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
import { handleExpense, updateExpense } from "@/app/action/expense"
import { useUserData } from "@/hooks/useUserData"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useExpenses } from "@/hooks/useExpenseData"
import { BadgePlus, Pencil } from "lucide-react"

interface ExpenseClaimFormProps {
  mode?: 'create' | 'edit'
  defaultValues?: Partial<ExpenseFormValues>
  expenseId?: string
  trigger?: React.ReactNode
  onSubmitSuccess?: () => void
}

export function ExpenseClaimForm({
  mode = 'create',
  defaultValues,
  expenseId,
  trigger,
  onSubmitSuccess
}: ExpenseClaimFormProps) {
  const { refetch } = useExpenses();
  const { data: session } = useSession()
  const { data: user } = useUserData(session?.user.id as string)
  const userinfo = user
  const [open, setOpen] = useState(false)

  const defaultFormValues = {
    ...useExpenseFormDefault().defaultValues,
    employeeName: userinfo ? `${userinfo.firstName} ${userinfo.lastName}` : "",
    ...defaultValues // Merge provided defaultValues
  }

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultFormValues
  })

  const onSubmit: SubmitHandler<ExpenseFormValues> = async (values) => {
    try {
      if (mode === 'edit' && expenseId) {
        // Use updateExpense action for edit mode
        await toast.promise(
          updateExpense(expenseId,values),
          {
            loading: 'Updating expense claim...',
            success: 'Updated expense claim successfully',
            error: 'Error updating expense claim!'
          }
        )
      } else {
        // Use handleExpense action for create mode
        await toast.promise(
          handleExpense(values),
          {
            loading: 'Creating expense claim...',
            success: 'Created expense claim successfully',
            error: 'Error creating expense claim!'
          }
        )
      }

      await refetch()
      setOpen(false)
      onSubmitSuccess?.()
    } catch (error) {
      console.error('Error submitting expense:', error)
    }
  }


  const defaultTrigger = mode === 'create' ? (
    <Button variant="default">
      <BadgePlus className="mr-2" /> Add Expense Claim
    </Button>
  ) : (
    <Button variant="outline" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="!max-w-[700px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === 'create' ? 'Add' : 'Edit'} Expense Claim
          </SheetTitle>
          <SheetDescription>
            Fill in the details of your expense claim.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoFields control={form.control} />
            <ForeignCurrencyFields control={form.control} />
            <ExpenseTypeAccordion control={form.control} />
            <Button type="submit">
              {mode === 'create' ? 'Submit' : 'Update'} Expense Claim
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}