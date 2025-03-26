import type { Control } from "react-hook-form"
import type { Expense } from "@/schema/expenseFormSchema"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExpenseFields, ExpenseTypeInputs } from "./ExpenseTypeInputs"

interface ExpenseTypeAccordionProps {
  control: Control<Expense>
  currencySymbol: string;
  useForeignCurrency: boolean;
  country?: string;
}
interface ExpenseTypeDefinition {
  type: keyof Expense["expenses"]
  label: string;
  fields: {
    name: ExpenseFields[keyof ExpenseFields]
    label: string;
    inputType: "number" | "text" | "textarea";
    isCurrency?: boolean; // เพิ่ม property นี้
  }[];
}

export function ExpenseTypeAccordion({ 
  control, 
  currencySymbol, 
  useForeignCurrency, 
  country}: ExpenseTypeAccordionProps) {
  const expenseTypes: ExpenseTypeDefinition[] = [
    {
      type: "fuel",
      label: "Fuel",
      fields: [
        { name: "liters", label: "Number of Liters", inputType: "number" ,isCurrency: false },
        { name: "totalCost", label: "Total Cost", inputType: "number", isCurrency: true },
      ],
    },
    {
      type: "accommodation",
      label: "Accommodation",
      fields: [
        { name: "nights", label: "Number of Nights", inputType: "number" ,isCurrency: false },
        { name: "totalCost", label: "Total Cost", inputType: "number" , isCurrency: true },
      ],
    },
    {
      type: "transportation",
      label: "Transportation",
      fields: [
        { name: "origin", label: "Origin", inputType: "text" },
        { name: "destination", label: "Destination", inputType: "text" },
        { name: "totalCost", label: "Total Cost", inputType: "number", isCurrency: true },
      ],
    },
    {
      type: "perDiem",
      label: "Per Diem",
      fields: [{ name: "amount", label: "Amount", inputType: "number" , isCurrency: true }],
    },
    {
      type: "medicalExpenses",
      label: "Medical Expenses",
      fields: [
        { name: "amount", label: "Amount", inputType: "number" , isCurrency: true },
        { name: "description", label: "Description of Treatment", inputType: "textarea" },
      ],
    },
    {
      type: "otherExpenses",
      label: "Other Expenses",
      fields: [
        { name: "amount", label: "Amount", inputType: "number" , isCurrency: true },
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
              type={expenseType.type as keyof Expense["expenses"]}
              fields={expenseType.fields}
              currencySymbol={currencySymbol}
              useForeignCurrency={useForeignCurrency}
              country={country}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

