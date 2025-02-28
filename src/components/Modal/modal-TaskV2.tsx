"use client"

import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardList, Edit } from "lucide-react"

type TaskStatus = "TODO" | "DOING" | "DONE"
type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

interface Task {
  id?: string
  taskName: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

interface TaskModalProps {
  mode: "create" | "edit" | "view"
  defaultValues?: Task
  onSave?: (task: Task) => void
  trigger?: React.ReactNode
}

const formSchema = z.object({
  id: z.string().optional(),
  taskName: z.string().min(2, { message: "Task name must be at least 2 characters." }),
  description: z.string().max(300, { message: "Description cannot exceed 300 characters." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"] as const),
  status: z.enum(["TODO", "DOING", "DONE"] as const),
})

export function TaskModal({ mode: initialMode, defaultValues, onSave, trigger }: TaskModalProps) {
  const [currentMode, setCurrentMode] = useState(initialMode)
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      taskName: "",
      description: "",
      priority: "LOW",
      status: "TODO",
    },
  })

  const charCount = form.watch("description")?.length || 0

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentMode === "view") return

    if (charCount > 300) {
      setShowAlert(true)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const task: Task = {
      ...values,
      id: values.id || `task-${Date.now()}`,
    }

    if (onSave) {
      onSave(task)
    }

    toast.success(currentMode === "create" ? "Task created successfully" : "Task updated successfully")
    setOpen(false)

    if (currentMode === "create") {
      form.reset({
        taskName: "",
        description: "",
        priority: "LOW",
        status: "TODO",
      })
    }
  }

  const getPriorityDetails = (priority: TaskPriority) => {
    switch (priority) {
      case "HIGH":
        return { color: "bg-red-500", label: "High" }
      case "MEDIUM":
        return { color: "bg-yellow-500", label: "Medium" }
      case "LOW":
        return { color: "bg-green-500", label: "Low" }
    }
  }

  const getStatusDetails = (status: TaskStatus) => {
    switch (status) {
      case "DONE":
        return { color: "bg-green-500", label: "Done" }
      case "DOING":
        return { color: "bg-blue-500", label: "In Progress" }
      case "TODO":
        return { color: "bg-gray-500", label: "To Do" }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant={currentMode === "create" ? "default" : "outline"}
              className="h-8 flex items-center gap-2"
              onClick={() => {
                setCurrentMode(initialMode)
              }}
            >
              <ClipboardList className="h-4 w-4" />
              <span>{currentMode === "create" ? "Create Task" : "View Task"}</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {currentMode === "view" ? "View Task" : currentMode === "edit" ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Task Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter task name"
                        {...field}
                        disabled={currentMode === "view"}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description"
                        className="resize-none min-h-[100px]"
                        disabled={currentMode === "view"}
                        {...field}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground text-right">{charCount}/300</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMode === "view" ? (
                  <>
                    <div>
                      <FormLabel className="text-base block mb-2">Priority</FormLabel>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityDetails(form.getValues("priority")).color}`}
                        />
                        {getPriorityDetails(form.getValues("priority")).label}
                      </div>
                    </div>
                    <div>
                      <FormLabel className="text-base block mb-2">Status</FormLabel>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <div className={`w-3 h-3 rounded-full ${getStatusDetails(form.getValues("status")).color}`} />
                        {getStatusDetails(form.getValues("status")).label}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Priority</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-3 h-3 rounded-full ${getPriorityDetails(field.value as TaskPriority).color}`}
                                    />
                                    {getPriorityDetails(field.value as TaskPriority).label}
                                  </div>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Select Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                                  {(["HIGH", "MEDIUM", "LOW"] as const).map((priority) => (
                                    <DropdownMenuRadioItem
                                      key={priority}
                                      value={priority}
                                      className="flex items-center gap-2"
                                    >
                                      <div className={`w-3 h-3 rounded-full ${getPriorityDetails(priority).color}`} />
                                      {getPriorityDetails(priority).label}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Status</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusDetails(field.value).color}`} />
                                    {getStatusDetails(field.value).label}
                                  </div>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                                  {(["TODO", "DOING", "DONE"] as const).map((status) => (
                                    <DropdownMenuRadioItem
                                      key={status}
                                      value={status}
                                      className="flex items-center gap-2"
                                    >
                                      <div className={`w-3 h-3 rounded-full ${getStatusDetails(status).color}`} />
                                      {getStatusDetails(status).label}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                {currentMode === "view" ? (
                  <Button type="button" onClick={() => setCurrentMode("edit")} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : currentMode === "create" ? (
                  <Button type="submit">Create</Button>
                ) : (
                  <>
                    <Button type="submit" className="mr-2">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCurrentMode("view")
                        form.reset(defaultValues)
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Description Too Long</AlertDialogTitle>
            <AlertDialogDescription>
              The description cannot exceed 300 characters. Please shorten it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

