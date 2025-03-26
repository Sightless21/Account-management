import { type Control, useWatch } from "react-hook-form"
import type { Expense } from "@/schema/expenseFormSchema"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ForeignCurrencyFieldsProps {
  control: Control<Expense>
}

export function ForeignCurrencyFields({ control }: ForeignCurrencyFieldsProps) {
  const useForeignCurrency = useWatch({
    control,
    name: "useForeignCurrency",
  })

  return (
    <>
      <FormField
        control={control}
        name="useForeignCurrency"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Use Foreign Currency</FormLabel>
              <FormDescription>Enable if the expense is in a foreign currency</FormDescription>
            </div>
            <FormControl>
              <Switch defaultChecked checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      {useForeignCurrency && (
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  )
}

