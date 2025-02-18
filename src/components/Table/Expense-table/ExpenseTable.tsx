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

interface ExpenseTable {
  userRole: Role
}

export default function ExpenseTable({ userRole }: ExpenseTable) {
  const { data: ExpensesData, isLoading, error } = useExpenses()


  const [nameFilter, setNameFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [expenseStatusFilter, setExpenseFilter] = useState<string>("")

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  const handleEdit = (dayOff: ExpenseFormValues) => {
    console.log("Edit day off:", dayOff)
    // Delete api
  }

  const handleDelete = (dayOff: ExpenseFormValues) => {
    console.log("Delete day off:", dayOff)
    // Delete api
  }

  const handleAccepted = (dayOff: ExpenseFormValues) => {
    console.log("✅ Approve day off (before update):", dayOff);
    // Update api
  }

  const handleDeclined = (dayOff: ExpenseFormValues) => {
    console.log("❌ Reject day off:", dayOff);
    // Update api
  }

  const handleReset = (dayOff: ExpenseFormValues) => {
    console.log("Reset day off:", dayOff);
    //Update api
  }

  const columns = getColumns(userRole, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onApprove: handleAccepted,
    onReject: handleDeclined,
    onReset: handleReset,
  })

  const filteredExpenses = ExpensesData?.filter((expense) => {
    const matchesName = nameFilter
      ? expense?.employeename?.toLowerCase().includes(nameFilter.toLowerCase())
      : true
    const matchesDate = dateRange && dateRange.from
      ? dateRange.to
        ? new Date(expense.transactionDate) >= dateRange.from && new Date(expense.transactionDate) <= dateRange.to
        : true
      : true
    return matchesName && matchesDate
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
        <Select onValueChange={setExpenseFilter} value={expenseStatusFilter} >
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
        {/* Add Expense */}
        <ExpenseClaimForm />
      </div>
      <DataTable columns={columns} data={filteredExpenses ?? []} />
    </div>
  )
}
