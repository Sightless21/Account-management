// ProjectStageCard.tsx
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CheckCircle, Clock, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type StageStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED"

export interface ProjectStageProps {
  title: string
  description?: string
  status: StageStatus
  startDate?: Date
  endDate?: Date
  progress?: number
  className?: string
}

export function ProjectStageCard({
  title,
  description,
  status,
  startDate,
  endDate,
  progress = 0,
  className,
}: ProjectStageProps) {
  const statusConfig = {
    COMPLETED: {
      label: "Completed",
      variant: "default" as const,
      icon: CheckCircle,
      progressColor: "bg-green-500",
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "default" as const,
      icon: Clock,
      progressColor: "bg-blue-500",
    },
    NOT_STARTED: {
      label: "Not Started",
      variant: "outline" as const,
      icon: HelpCircle,
      progressColor: "bg-gray-300",
    },
  }

  const currentStatus = statusConfig[status]
  const StatusIcon = currentStatus.icon

  const formatDate = (date?: Date) => {
    if (!date) return "N/A"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className={cn(
      "overflow-hidden",
      "w-[450px] h-[200px]", 
      "flex flex-col",
      className
    )}>
      <CardHeader className="pb-2 shrink-0">
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <CardTitle className="text-xl truncate">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 text-sm text-muted-foreground truncate ">
                {description}
              </CardDescription>
            )}
          </div>
          <Badge variant={currentStatus.variant}>
            <StatusIcon className="mr-1 h-3.5 w-3.5" />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow flex flex-col justify-between">
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <CalendarDays className="mr-1 h-3.5 w-3.5" />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>

        {progress !== undefined && (
          <div className="space-y-1.5">
            <Progress value={progress} className="h-2" indicatorClassName={currentStatus.progressColor} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground shrink-0">
        {startDate && endDate && (
          <div>Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days</div>
        )}
      </CardFooter>
    </Card>
  )
}