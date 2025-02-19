import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import React, { useState } from "react"
import { ExpenseFormValues } from "@/schema/expenseFormSchema"
import { Role } from "@/types/users"
import { useExpenses } from "@/hooks/useExpenseData"
import { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExpenseClaimForm } from "@/components/Sheet/ExpenseClaimForm"
import { ExpenseDialog } from "@/components/Modal/modal-Expenses"
import { useExpenseStore } from "@/store/useExpenenseUIStore"
import { Expense } from "@/types/expense"
import { deleteExpense, updateExpense } from "@/app/action/expense"
import { toast } from "sonner"
interface ExpenseTable {
  userRole: Role
}

export default function ExpenseTable({ userRole }: ExpenseTable) {
  const { data: ExpensesData, isLoading, error } = useExpenses()
  const selectedExpense = useExpenseStore(state => state.selectedExpense)
  const setSelectedExpense = useExpenseStore(state => state.setSelectedExpense)

  const [nameFilter, setNameFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [expenseStatusFilter, setExpenseStatusFilter] = useState<string>("")

  // Convert ExpenseFormValues to Expense type
  const formatExpenseForDialog = (expense: ExpenseFormValues): Expense => {
    
    const expenses = expense.expenses as {
      fuel: { liters: number; totalCost: number };
      accommodation: { nights: number; totalCost: number };
      transportation: { origin: string; destination: string; totalCost: number };
      perDiem: { amount: number };
      medicalExpenses: { amount: number; description: string };
      otherExpenses: { amount: number; description: string };
    };

    // Ensure transactionDate is a Date object
    const transactionDate = new Date(expense.transactionDate);

    return {
      ...expense,
      employeeName: expense.employeeName || "",
      transactionDate: transactionDate instanceof Date && !isNaN(transactionDate.getTime())
        ? transactionDate.toISOString()
        : "", // Default to empty string if invalid date
      attachmentUrl: expense.attachmentUrl || "",
      attachmentPublicId: expense.attachmentPublicId || "",
      country: expense.country || "",
      createdAt: expense.createdAt || new Date().toISOString(),
      updatedAt: expense.updatedAt || new Date().toISOString(),
      expenses,
    };
  };

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  const handleDelete = (expense: ExpenseFormValues) => {
    console.log("Delete day off:", expense)
    // Delete api
    toast.promise(deleteExpense(expense.id), {
      loading: "Deleting expense...",
      success: "Expense deleted successfully!",
      error: "Error deleting expense",
    })
  }

  const handleAccepted = (expense: ExpenseFormValues) => {
    console.log("✅ Approve expense (before update):", expense);
    // Update api
    toast.promise(updateExpense(expense.id, { ...expense, status: "Accepted" }), {
      loading: "Updating expense...",
      success: "Expense updated successfully!",
      error: "Error updating expense",
    })
  }

  const handleDeclined = (expense: ExpenseFormValues) => {
    console.log("❌ Reject expense:", expense);
    // Update api
    toast.promise(updateExpense(expense.id, { ...expense, status: "Declined" }), {
      loading: "Updating expense...",
      success: "Expense updated successfully!",
      error: "Error updating expense",
    })
  }

  const handleReset = (expense: ExpenseFormValues) => {
    console.log("Reset expense:", expense);
    //Update api
    toast.promise(updateExpense(expense.id, { ...expense, status: "Pending" }), {
      loading: "Updating expense...",
      success: "Expense updated successfully!",
      error: "Error updating expense",
    })
  }

  const columns = getColumns(userRole, {
    onDelete: handleDelete,
    onApprove: handleAccepted,
    onReject: handleDeclined,
    onReset: handleReset,
  })

  const filteredExpenses = ExpensesData?.filter((expense) => {
    const matchesName = nameFilter
      ? expense?.employeeName?.toLowerCase().includes(nameFilter.toLowerCase())
      : true
    const matchesDate = dateRange && dateRange.from
      ? dateRange.to
        ? new Date(expense.transactionDate) >= dateRange.from && new Date(expense.transactionDate) <= dateRange.to
        : true
      : true
    const matchesStatus = expenseStatusFilter === "All" || !expenseStatusFilter || expense.status === expenseStatusFilter
    return matchesName && matchesDate && matchesStatus
  })

  const ExpenseStatus = Array.from(new Set(ExpensesData?.map((expense) => expense.status) ?? []))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search by employee name */}
        <Input placeholder="Search by employee name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="max-w-sm w-[200px]" />
        {/* Select Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[250px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {/* Select Expense Status */}
        <Select onValueChange={setExpenseStatusFilter} value={expenseStatusFilter} >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {ExpenseStatus.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Reset */}
        <Button
        variant={nameFilter || dateRange || expenseStatusFilter ? "destructive" : "outline"}
        onClick={() => {
          setNameFilter("")
          setDateRange(undefined)
          setExpenseStatusFilter("")
        }}
        >
        
          Reset
        </Button>
        {/* Add Expense */}
        <ExpenseClaimForm />
      </div>
      <DataTable columns={columns} data={filteredExpenses ?? []} />
      {/* View Mode Example */}
      {selectedExpense && (
        <ExpenseDialog
          expense={formatExpenseForDialog(selectedExpense)}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  )
}
