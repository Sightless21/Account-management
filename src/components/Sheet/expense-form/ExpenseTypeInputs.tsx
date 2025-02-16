import type { Control } from "react-hook-form"
import type { ExpenseFormValues } from "@/schema/expenseFormSchema"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type ExpenseFields = {
  fuel: "liters" | "totalCost"
  accommodation: "nights" | "totalCost"
  transportation: "origin" | "destination" | "totalCost"
  perDiem: "amount"
  medicalExpenses: "amount" | "description"
  otherExpenses: "amount" | "description"
}

// Create a more specific path type for each expense type
type ExpenseTypeFields<T extends keyof ExpenseFormValues["expenses"]> = {
  fuel: "expenses.fuel.liters" | "expenses.fuel.totalCost"
  accommodation: "expenses.accommodation.nights" | "expenses.accommodation.totalCost"
  transportation: "expenses.transportation.origin" | "expenses.transportation.destination" | "expenses.transportation.totalCost"
  perDiem: "expenses.perDiem.amount"
  medicalExpenses: "expenses.medicalExpenses.amount" | "expenses.medicalExpenses.description"
  otherExpenses: "expenses.otherExpenses.amount" | "expenses.otherExpenses.description"
}[T]

interface ExpenseTypeInputsProps {
  control: Control<ExpenseFormValues>
  type: keyof ExpenseFormValues["expenses"]
  fields: {
    name: ExpenseFields[keyof ExpenseFields]
    label: string
    inputType: "number" | "text" | "textarea"
  }[]
}

export function ExpenseTypeInputs({ control, type, fields }: ExpenseTypeInputsProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        // Use type assertion to ensure the field name matches the schema
        const fieldName = `expenses.${type}.${field.name}` as ExpenseTypeFields<typeof type>

        return (
          <FormField
            key={field.name}
            control={control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.inputType === "textarea" ? (
                    <div className="w-[320px] m-1">
                      <Textarea
                        {...formField}
                        value={formField.value as string || ''}
                      />
                    </div>
                  ) : (
                    <Input
                      className="w-[320px] m-1"
                      type={field.inputType}
                      value={formField.value as string | number || ''}
                      onChange={(e) =>
                        field.inputType === "number"
                          ? formField.onChange(e.target.value ? Number.parseFloat(e.target.value) : '')
                          : formField.onChange(e.target.value)
                      }
                      onBlur={formField.onBlur}
                      name={formField.name}
                      ref={formField.ref}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </div>
  )
}