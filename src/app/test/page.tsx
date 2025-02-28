"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

import { CreateTask } from "@/components/Modal/modal-TaskV2"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { format } from "date-fns"

// Types
interface Task {
  id: string
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "TODO" | "DOING" | "DONE"
  dueDate?: Date
}

// Initial tasks
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Design new dashboard",
    description:
      "Create wireframes and mockups for the new admin dashboard interface. Focus on user experience and modern design principles.",
    priority: "HIGH",
    status: "DOING",
    dueDate: new Date(2024, 2, 15),
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Add user login and registration functionality using Next.js and NextAuth.js",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: new Date(2024, 2, 20),
  },
  {
    id: "task-3",
    title: "Write documentation",
    description: "Document the API endpoints and usage examples for the development team",
    priority: "LOW",
    status: "DONE",
    dueDate: new Date(2024, 2, 10),
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask])
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "text-red-700 bg-red-50 border-red-200"
      case "MEDIUM":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "LOW":
        return "text-green-700 bg-green-50 border-green-200"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return "text-green-700 bg-green-50 border-green-200"
      case "DOING":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "TODO":
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return "Completed"
      case "DOING":
        return "In Progress"
      case "TODO":
        return "To Do"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your tasks and track their progress</p>
        </div>
        <CreateTask onTaskCreated={handleTaskCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
                <Badge className={cn("shrink-0", getPriorityColor(task.priority))}>{task.priority.toLowerCase()}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(task.dueDate, "MMM d")}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

