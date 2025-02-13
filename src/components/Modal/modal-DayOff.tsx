"use client"

import * as React from "react"
import * as z from "zod"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, BadgePlus, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { LeaveType } from "@/types/day-off"
import { useSession } from "next-auth/react"
import { useUserData } from "@/hooks/useUserData"
import { useCreateDayOff, useUpdateDayOff } from "@/hooks/useDayOffData"
import { DayoffType } from "@/types/day-off"
import { useState } from "react"

type DayoffModalProps = {
  defaultValue?: DayoffType;
  mode?: "edit";
};

const leaveTypes = [
  { value: "Vacation", label: "Vacation" },
  { value: "Sick", label: "Sick Leave" },
  { value: "Personal", label: "Personal Leave" },
  { value: "Maternity", label: "Maternity Leave" },
]
export const leaveTypeSchema = z.enum(["Vacation", "Sick", "Personal", "Maternity"]);
export const leaveStatusSchema = z.enum(["Pending", "Accepted", "Declined"]);
export const userRoleSchema = z.enum(["EMPLOYEE", "HR", "MANAGER", "ADMIN"]);

const formSchema = z.object({
  id: z.string().optional(),
  employeeName: z.string().min(1, "Please enter an employee name."),
  leaveType: z.object({
    type: z.enum(["Vacation", "Sick", "Personal", "Maternity"]),
  }),
  date: z.object({
    from: z.date({
      required_error: "Please select a start date",
    }),
    to: z.date({
      required_error: "Please select an end date",
    }),
  }),
  status: z.enum(["Pending", "Accepted", "Declined"]),
});

export function DayoffModal({ defaultValue, mode }: DayoffModalProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [leaveTypeOptions] = useState(leaveTypes)
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>(
    defaultValue ? {
      from: defaultValue.date.from ? new Date(defaultValue.date.from) : undefined,
      to: defaultValue.date.to ? new Date(defaultValue.date.to) : undefined,
    } : undefined
  );
  const { data: user } = useUserData(session?.user.id as string)
  const userinfo = user
  const { mutate: createDayOff } = useCreateDayOff()
  const { mutate: updateDayOff } = useUpdateDayOff()
  // console.log("defaultValue", defaultValue)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue ? {
      id: defaultValue.id || "",
      employeeName: defaultValue.employeeName,
      leaveType: { type: defaultValue.leaveType }, // Wrap in object to match schema
      date: {
        from: defaultValue.date.from ? new Date(defaultValue.date.from) : undefined,
        to: defaultValue.date.to ? new Date(defaultValue.date.to) : undefined,
      },
      status: defaultValue.status,
    } : {
      employeeName: userinfo?.firstName + " " + userinfo?.lastName as string,
      leaveType: { type: "Vacation" },  // ใส่ค่าเริ่มต้น
      date: { from: new Date(), to: new Date() },  // ใส่ค่าเริ่มต้น
      status: "Pending",  // ใส่ค่าเริ่มต้น
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values", values)
    // Ensure dates are defined before proceeding
    if (!values.date.from || !values.date.to) {
      return; // Or show an error message
    }
    const formatData = {
      id: defaultValue?.id || "",
      userId: userinfo?.id as string,
      employeeName: values.employeeName,
      leaveType: values.leaveType.type,
      status: values.status,
      date: {
        from: values.date.from,
        to: values.date.to,
      },
    };

    //DONE : API calling 
    if (mode === "edit") {
      updateDayOff({ id: formatData.id, newData: formatData });
    } else {
      createDayOff(formatData);
      form.reset();
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : 
        <Button variant={"default"}>
          <BadgePlus /> Add New Leave
        </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[678px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Leave of Absence" : "Add New Leave of Absence"}</DialogTitle>
          <DialogDescription>Enter the details for the employee&apos;s leave of absence.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeName"
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
                          <CommandEmpty>No leave types found.</CommandEmpty>
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
              name="date"
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
                    <PopoverContent className="w-auto p-0" align="center" sideOffset={5}>
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from ?? new Date()}
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate && newDate.from) setDate({ from: newDate.from, to: newDate.to })
                          else setDate(undefined)
                          form.setValue("date", {
                            from: newDate?.from ? parseISO(format(newDate.from, "yyyy-MM-dd'T'HH:mm:ss'Z'")) : new Date(),
                            to: newDate?.to ? parseISO(format(newDate.to, "yyyy-MM-dd'T'HH:mm:ss'Z'")) : new Date(),
                          })
                          form.trigger("date")
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
              <Button type="submit">{mode === "edit" ? "Update Leave" : "Add Leave"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}