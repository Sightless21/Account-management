"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, BadgePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../ui/input"

// Actions
import { LeaveStatus, LeaveType } from "@/types/day-off"
import { useSession } from "next-auth/react"
import { useUserData } from "@/hooks/useUserData"
import { useCreateDayOff } from "@/hooks/useDayOffData"

const leaveTypes = [
  { value: "Vacation", label: "Vacation" },
  { value: "Sick", label: "Sick Leave" },
  { value: "Personal", label: "Personal Leave" },
  { value: "Maternity", label: "Maternity Leave" },
]
const formSchema = z.object({
  employee: z.string().min(1, "Please enter an employee name."),
  leaveType: z.object({
    type: z.enum(["Vacation", "Sick", "Personal", "Maternity"]),
  }),
  dateRange: z.object({
    from: z.date().optional(), // ✅ อนุญาตให้เป็น undefined ได้
    to: z.date().optional(),   // ✅ อนุญาตให้เป็น undefined ได้
  }),
});

//FIXME
export function DayoffModal() {
  const {data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [leaveTypeOptions] = React.useState(leaveTypes)
  const [date, setDate] = React.useState<{ from: Date | undefined; to: Date | undefined; } | undefined>(/* initial value */);
  const { data: user } = useUserData(session?.user.id as string);
  const userinfo = user
  const { mutate: createDayOff } = useCreateDayOff();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formatData = {
      id: "",
      userId: userinfo?.id as string,
      employeeName: userinfo?.firstName + " " + userinfo?.lastName as string,
      leaveType: values.leaveType.type as LeaveType,
      date: {
        from: values.dateRange.from as Date,
        to: values.dateRange.to as Date
      },
      status: "Pending" as LeaveStatus,
    }
    createDayOff(formatData)
    setOpen(false)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}><BadgePlus />Add New Leave</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[678px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add New Leave of Absence</DialogTitle>
          <DialogDescription>Enter the details for the employee&apos;s leave of absence.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter employee name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Leave Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? leaveTypeOptions.find((type) => type.value === field.value.type)?.label
                            : "Select leave type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search leave type..." />
                        <CommandList>
                          <CommandEmpty>
                            No leave types found.
                          </CommandEmpty>
                          <CommandGroup>
                            {leaveTypeOptions.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => form.setValue("leaveType", { type: type.value as LeaveType })}
                              >
                                <Check className={cn("mr-2 h-4 w-4", type.value === field.value?.type ? "opacity-100" : "opacity-0")} />
                                {type.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRange"
              render={({ }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from ?? new Date()}
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate && newDate.from) setDate({ from: newDate.from, to: newDate.to }); else setDate(undefined);
                          // ✅ อัปเดต React Hook Form ให้ค่าเป็น `string`
                          form.setValue("dateRange", {
                            from: newDate?.from
                              ? parseISO(format(newDate.from, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
                              : new Date(), // ✅ กำหนดค่า default

                            to: newDate?.to
                              ? parseISO(format(newDate.to, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
                              : new Date(), // ✅ กำหนดค่า default
                          });

                          // ✅ บังคับตรวจสอบค่าใหม่
                          form.trigger("dateRange");
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Leave</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
