import type { Control } from "react-hook-form"
import type { Expense } from "@/schema/expenseFormSchema"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/ui/currency-input"

export type ExpenseFields = {
  fuel: "liters" | "totalCost"
  accommodation: "nights" | "totalCost"
  transportation: "origin" | "destination" | "totalCost"
  perDiem: "amount"
  medicalExpenses: "amount" | "description"
  otherExpenses: "amount" | "description"
}

// Create a more specific path type for each expense type
type ExpenseTypeFields<T extends keyof Expense["expenses"]> = {
  fuel: "expenses.fuel.liters" | "expenses.fuel.totalCost"
  accommodation: "expenses.accommodation.nights" | "expenses.accommodation.totalCost"
  transportation: "expenses.transportation.origin" | "expenses.transportation.destination" | "expenses.transportation.totalCost"
  perDiem: "expenses.perDiem.amount"
  medicalExpenses: "expenses.medicalExpenses.amount" | "expenses.medicalExpenses.description"
  otherExpenses: "expenses.otherExpenses.amount" | "expenses.otherExpenses.description"
}[T]

interface ExpenseTypeInputsProps {
  control: Control<Expense>
  type: keyof Expense["expenses"]
  fields: {
    name: ExpenseFields[keyof ExpenseFields]
    label: string
    inputType: "number" | "text" | "textarea"
    isCurrency?: boolean; // เพิ่ม property นี้
  }[]
  currencySymbol: string;
  useForeignCurrency: boolean;
  country?: string;
}

export function ExpenseTypeInputs({ 
  control,
  type,
  fields,
  currencySymbol 
}: ExpenseTypeInputsProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const fieldName = `expenses.${type}.${field.name}` as ExpenseTypeFields<typeof type>;

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
                    <div className="w-[530px] m-2">
                      <Textarea
                        {...formField}
                        value={formField.value as string || ''}
                      />
                    </div>
                  ) : field.inputType === "number" ? (
                    <div className="w-[530px] m-2">
                      {field.isCurrency ? (
                        <CurrencyInput
                          value={formField.value as number || 0}
                          onValueChange={(value) => formField.onChange(value)}
                          currencySymbol={currencySymbol}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          type="number"
                          value={formField.value as number || 0}
                          onChange={(e) =>
                            formField.onChange(e.target.value ? Number.parseFloat(e.target.value) : 0)
                          }
                          onBlur={formField.onBlur}
                          name={formField.name}
                          ref={formField.ref}
                          className="w-full"
                        />
                      )}
                    </div>
                  ) : (
                    <Input
                      className="w-[530px] m-2"
                      type={field.inputType}
                      value={formField.value as string || ''}
                      onChange={formField.onChange}
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
        );
      })}
    </div>
  );
}