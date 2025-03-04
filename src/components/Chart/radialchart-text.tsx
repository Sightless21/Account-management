"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import CustomAlertDialog from "@/components/ui/customAlertDialog"
import { Input } from "@/components/ui/input"
import { useDeleteProject, useUpdateProject } from "@/hooks/useProjectData"
import { Pencil, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { toast } from "sonner"
import { Button } from "../ui/button"

interface RadialChartProps {
  data: { name: string; value: number; fill: string }[]
  config: ChartConfig
  title: string
  value: number
  projectID: string
  description?: string
  footerText?: string
  color?: string // Add this line
}

export function RadialChart({
  data,
  config,
  title,
  value,
  projectID,
  description,
  footerText,
  color,
}: RadialChartProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutateAsync: deleteProject, isPending } = useDeleteProject()
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject()
  const router = useRouter()

  const handleSave = () => {
    setIsEditing(false)
    if (newTitle.trim() !== "" && newTitle !== title) {
      toast.promise(updateProject({ id: projectID, NewNameProject: newTitle }), {
        loading: "Updating project...",
        success: "Project updated successfully",
        error: "Failed to update project",
      })
    }
  }

  return (
    <Card className="flex flex-col w-[250px] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <CardHeader className="static items-center pb-0">
        {isEditing ? (
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <div
            className="group flex cursor-pointer items-center gap-2 hover:underline"
            onClick={() => setIsEditing(true)}
          >
            <CardTitle>{title}</CardTitle>
            <Pencil size={20} className="text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
        )}
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={data} startAngle={0} endAngle={value} innerRadius={80} outerRadius={110}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
              fill={color || data[0].fill} // Use provided color or fall back to data fill
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          {data[0].value.toFixed(0)}%
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {config.value.label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-8 text-sm">
        <div className="leading-none text-muted-foreground">{footerText}</div>
        <Button
          onClick={() => {
            if (title) {
              router.push(`/Dashboard/ProjectBoard/${title}`)
            }
          }}
        >
          View Tasks
        </Button>
        <div className="flex flex-row">
          <Button variant="ghost" className="hover:bg-red-400 hover:text-white" disabled={isPending} onClick={() => setIsDeleting(true)}>
            <Trash2 />
          </Button>
        </div>
        <CustomAlertDialog
          open={isDeleting}
          onOpenChange={setIsDeleting}
          onConfirm={() => deleteProject(projectID)}
          title="Delete Project"
          description={`Are you sure you want to delete ${title} Project?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmIcon={Trash2}
          cancelIcon={X}
        />
      </CardFooter>
    </Card>
  )
}

