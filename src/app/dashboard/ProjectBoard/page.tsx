"use client"
import { RadialChart } from "@/components/Chart/radialchart-text"
import { ModalProject } from "@/components/Modal/modal-project"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useCreateProject, useProjects } from "@/hooks/useProjectData"
import { useProjectUIStore } from "@/store/useProjectUIStore"
import type { ChartData, Project, Task } from "@/types/projects"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"
import { useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"

export default function Page() {
  const { sortOption, searchQuery, currentPage, setSortOption, setSearchQuery, setCurrentPage } = useProjectUIStore()
  const { data: projects } = useProjects()
  const { mutateAsync: createProject } = useCreateProject()
  const queryClient = useQueryClient()

  const generateChartData = useCallback((project: Project): ChartData => {
    const doneTasks = project.task?.filter((task: Task) => task.status === "DONE").length
    const totalTasks = project.task?.length
    const donePercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0
    const doneAngle = (donePercentage * 360) / 100
    const projectId = project.id
    const description = project.description

    // Choose color based on completion percentage
    let fillColor = "hsl(173 58% 39%)"
    if (donePercentage < 30) {
      fillColor = "hsl(0, 76%, 50%)"
    } else if (donePercentage < 70) {
      fillColor = "hsl(40, 76%, 50%)"
    }
    return {
      projectName: project.projectName,
      chartData: [
        {
          name: "Done Tasks",
          value: donePercentage,
          fill: fillColor,
        },
      ],
      chartConfig: { value: { label: "Done" } },
      donePercentage,
      doneAngle,
      totalTasks,
      doneTasks,
      projectId,
      description
    }
  }, [])

  async function handleAddProject(projectName: string, description?: string) { // เพิ่มพารามิเตอร์ description
    try {
      const newProject = {
        id: "",
        projectName: projectName,
        description: description || "", // เพิ่ม description
        task: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      toast.promise(createProject(newProject), {
        loading: "Adding project...",
        success: "Successfully added project",
        error: "Error adding project",
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  }

  // 📌 รีเฟรชข้อมูลทุกครั้งที่หน้า Page นี้ถูกเปิด
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["projects"] })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }, [queryClient])

  // 📌 เรียงลำดับโครงการตามเงื่อนไขที่เลือก
  const sortedProjects = useMemo(() => {
    if (!projects) return []
    const sorted = [...projects]
    switch (sortOption) {
      case "Sort A-Z":
        sorted.sort((a, b) => a.projectName.localeCompare(b.projectName))
        break
      case "Sort Z-A":
        sorted.sort((a, b) => b.projectName.localeCompare(a.projectName))
        break
      case "Most task":
        sorted.sort((a, b) => (b.task?.length ?? 0) - (a.task?.length ?? 0))
        break
      case "Less task":
        sorted.sort((a, b) => (a.task?.length ?? 0) - (b.task?.length ?? 0))
        break
    }

    return sorted
  }, [projects, sortOption])

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((project) => project.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [sortedProjects, searchQuery])

  const projectsPerPage = 8
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage).map(generateChartData)
  }, [filteredProjects, currentPage, projectsPerPage, generateChartData])

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const projectnum = paginatedProjects.length === 0 ? true : false

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="container">
        <Card className="flex flex-col h-full mb-3">
          <CardHeader className="items-center">
            <CardTitle>Overall Project Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 mr-2 flex items-center justify-end gap-3">
              {projectnum ? "" : <ModalProject createProject={handleAddProject} />}
              <Input
                type="text"
                placeholder="Search Project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 h-8"
              />
              {searchQuery && (
                <Button className="h-8" variant={"destructive"} onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 w-44 h-8">
                    {sortOption}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Sort A-Z", "Sort Z-A", "Most task", "Less task"].map((option) => (
                    <DropdownMenuItem key={option} onClick={() => setSortOption(option)}>
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap justify-center gap-7">
              {paginatedProjects.length === 0 ? (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-5">
                  <p className="text-2xl font-semibold">Not found Project</p>
                  <ModalProject createProject={handleAddProject} />
                </div>
              ) : (
                paginatedProjects.map((project) => (
                  <RadialChart
                    key={project.projectId}
                    data={project.chartData}
                    config={project.chartConfig}
                    title={project.projectName}
                    value={project.doneAngle}
                    projectID={project.projectId}
                    description={project.description || ""}
                    footerText={`Tasks completed: ${project.doneTasks} / ${project.totalTasks}`}
                  />
                ))
              )}
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

