import type { Control } from "react-hook-form"
import type { ExpenseFormValues } from "@/schema/expenseFormSchema"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExpenseFields, ExpenseTypeInputs } from "./ExpenseTypeInputs"

interface ExpenseTypeAccordionProps {
  control: Control<ExpenseFormValues>
}
interface ExpenseTypeDefinition {
  type: keyof ExpenseFormValues["expenses"]
  label: string;
  fields: {
    name: ExpenseFields[keyof ExpenseFields]
    label: string;
    inputType: "number" | "text" | "textarea";
  }[];
}

export function ExpenseTypeAccordion({ control }: ExpenseTypeAccordionProps) {
  const expenseTypes: ExpenseTypeDefinition[] = [
    {
      type: "fuel",
      label: "Fuel",
      fields: [
        { name: "liters", label: "Number of Liters", inputType: "number" },
        { name: "totalCost", label: "Total Cost", inputType: "number" },
      ],
    },
    {
      type: "accommodation",
      label: "Accommodation",
      fields: [
        { name: "nights", label: "Number of Nights", inputType: "number" },
        { name: "totalCost", label: "Total Cost", inputType: "number" },
      ],
    },
    {
      type: "transportation",
      label: "Transportation",
      fields: [
        { name: "origin", label: "Origin", inputType: "text" },
        { name: "destination", label: "Destination", inputType: "text" },
        { name: "totalCost", label: "Total Cost", inputType: "number" },
      ],
    },
    {
      type: "perDiem",
      label: "Per Diem",
      fields: [{ name: "amount", label: "Amount", inputType: "number" }],
    },
    {
      type: "medicalExpenses",
      label: "Medical Expenses",
      fields: [
        { name: "amount", label: "Amount", inputType: "number" },
        { name: "description", label: "Description of Treatment", inputType: "textarea" },
      ],
    },
    {
      type: "otherExpenses",
      label: "Other Expenses",
      fields: [
        { name: "amount", label: "Amount", inputType: "number" },
        { name: "description", label: "Description of Expense", inputType: "textarea" },
      ],
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {expenseTypes.map((expenseType) => (
        <AccordionItem key={expenseType.type} value={expenseType.type}>
          <AccordionTrigger>{expenseType.label}</AccordionTrigger>
          <AccordionContent>
            <ExpenseTypeInputs
              control={control}
              type={expenseType.type as keyof ExpenseFormValues["expenses"]}
              fields={expenseType.fields}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

