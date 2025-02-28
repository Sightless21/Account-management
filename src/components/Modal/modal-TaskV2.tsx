"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, Plus, AlertCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "TODO" | "DOING" | "DONE"
  dueDate?: Date
}

interface CreateTaskProps {
  onTaskCreated?: (task: Task) => void
}

export function CreateTask({ onTaskCreated }: CreateTaskProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM")
  const [dueDate, setDueDate] = useState<Date>()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    // Validate
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (title.length < 3) {
      setError("Title must be at least 3 characters")
      return
    }

    if (!description.trim()) {
      setError("Description is required")
      return
    }

    // Create task object
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "TODO",
      dueDate,
    }

    // Call the callback
    if (onTaskCreated) {
      onTaskCreated(newTask)
    }

    // Show success message
    toast.success("Task created successfully")

    // Reset form and close dialog
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("MEDIUM")
    setDueDate(undefined)
    setError(null)
  }

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "HIGH":
        return "text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
      case "MEDIUM":
        return "text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
      case "LOW":
        return "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError(null)
              }}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              className="resize-none min-h-[100px]"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setError(null)
              }}
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup
              className="flex gap-2"
              defaultValue={priority}
              onValueChange={(value) => setPriority(value as Task["priority"])}
            >
              {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                <Label
                  key={p}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md border p-4 text-center [&:has([data-state=checked])]:border-primary",
                    getPriorityColor(p),
                  )}
                >
                  <RadioGroupItem value={p} className="sr-only" />
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Due Date Selection */}
          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Task Preview */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="text-sm font-medium">Task Preview</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{title || "Task Title"}</div>
                <Badge className={cn("capitalize", getPriorityColor(priority))}>{priority.toLowerCase()}</Badge>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {description || "Task description will appear here"}
              </div>
              {dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Due {format(dueDate, "PPP")}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

