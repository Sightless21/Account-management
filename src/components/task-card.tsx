"use client"
import { Badge } from "@/components/ui/badge"
import type React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Clock, GripVertical, AlertCircle, CheckCircle2, Circle } from "lucide-react"
import { TaskModal } from "@/components/Modal/modal-TaskV2"
import { format } from "date-fns"
import { Task } from "@/types/projects"
import { Large, Small, Muted } from "@/components/ui/typography"

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, task: Task) => void
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const getPriorityDetails = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return {
          color: "text-red-700 bg-red-50 border-red-200",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "High Priority",
        }
      case "MEDIUM":
        return {
          color: "text-yellow-700 bg-yellow-50 border-yellow-200",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Medium Priority",
        }
      case "LOW":
        return {
          color: "text-green-700 bg-green-50 border-green-200",
          icon: <CheckCircle2 className="h-3 w-3" />,
          label: "Low Priority",
        }
    }
  }

  const getStatusDetails = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return {
          color: "bg-green-500",
          label: "Completed",
        }
      case "DOING":
        return {
          color: "bg-blue-500",
          label: "In Progress",
        }
      case "TODO":
        return {
          color: "bg-gray-500",
          label: "To Do",
        }
    }
  }

  const priorityDetails = getPriorityDetails(task.priority)
  const statusDetails = getStatusDetails(task.status)

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group relative border-0 shadow-sm transition-all w-full",
          "hover:shadow-md hover:border-primary/50",
          "focus-within:shadow-md focus-within:border-primary",
          "dark:hover:border-primary/30 dark:focus-within:border-primary/30",
        )}
        draggable
        onDragStart={(e) => onDragStart(e, task)}
      >
        {/* Status Indicator */}
        <div className={cn("absolute top-0 left-0 w-1 h-full rounded-l", statusDetails.color)} />
        <CardHeader className="p-3 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium", priorityDetails?.color)}>
                  {priorityDetails?.icon}
                  <Small className="ml-1">{task.priority}</Small>
                </Badge>
                {task.dueDate && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Due: {format(new Date(task.dueDate), "PPP")}</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Large>{task.taskName}</Large>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-muted"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Drag to reorder</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-1.5">
          <Muted className="text-sm text-muted-foreground line-clamp-2">{task.description}</Muted>
        </CardContent>
        <CardFooter className="p-3 gap-3 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium">{task.assignee.charAt(0).toUpperCase()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side={"right"}>Assigned to: {task.assignee}</TooltipContent>
              </Tooltip>
            )}
            <div className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-current text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{statusDetails.label}</span>
            </div>
          </div>
          <TaskModal
            mode="view-edit"
            defaultValues={task} 
            projectId={task.id}
          />
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

