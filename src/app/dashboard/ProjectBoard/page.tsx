"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"; // นำเข้า Input
import { ChevronDown } from "lucide-react";
import { ModalProject } from "@/components/Modal/modal-Project";
import { RadialChart } from "@/components/Chart/radialchart-text";
import { useProjectStore } from "@/hooks/useProjectStore";
import { toast } from "sonner";

// Define types
interface Task {
  id: string;
  status: string;
  description: string;
  priority: string;
}

export interface Project {
  id: string;
  projectName: string;
  task: Task[];
}

interface ChartData {
  projectId: string;
  projectName: string;
  chartData: {
    name: string;
    value: number;
    fill: string;
  }[];
  chartConfig: {
    value: { label: string };
  };
  donePercentage: number;
  doneAngle: number;
  totalTasks: number;
  doneTasks: number;
}

/**
 * Page component for the Project Board page
 */
export default function Page() {
  /**
   * State variables
   */
  const { projects, fetchProjects, addProject } = useProjectStore();
  const [sortOption, setSortOption] = useState<string>("Order by"); // ค่าเริ่มต้น
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  /**
   * Generate chart data for each project
   * @param project The project data
   * @returns The chart data
   */
  const generateChartData = useCallback((project: Project): ChartData => {
    const doneTasks = project.task?.filter(
      (task) => task.status === "done",
    ).length;
    const totalTasks = project.task?.length;
    const donePercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
    const doneAngle = (donePercentage * 360) / 100;
    const projectId = project.id;

    return {
      projectName: project.projectName,
      chartData: [
        {
          name: "Done Tasks",
          value: donePercentage,
          fill: "var(--color-done)",
        },
      ],
      chartConfig: { value: { label: "Done" } },
      donePercentage,
      doneAngle,
      totalTasks,
      doneTasks,
      projectId,
    };
  }, []);

  // ดึงข้อมูลโปรเจกต์เมื่อ component ถูก mount
  useEffect(() => {
    toast.promise(fetchProjects(), {
      loading: "Loading projects...",
      success: "Successfully load projects",
      error: "Error loading projects",
    })
  }, [fetchProjects]);

  /**
   * Handle the add project button
   * @param projectName The name of the new project
   */
  const handleAddProject = async (projectName: string) => {
    try {
      const newProject = {
        id: "",
        projectName: projectName,
        task: [],
      };
      toast.promise(addProject(newProject), {
        loading: "Adding project...",
        success: "Successfully add project",
        error: "Error adding project",
      })
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // 📌 เรียงลำดับโครงการตามเงื่อนไขที่เลือก
  const sortedProjects = useMemo(() => {
    const sorted = [...projects];

    switch (sortOption) {
      case "Sort A-Z":
        sorted.sort((a, b) => a.projectName.localeCompare(b.projectName));
        break;
      case "Sort Z-A":
        sorted.sort((a, b) => b.projectName.localeCompare(a.projectName));
        break;
      case "Most task":
        sorted.sort((a, b) => (b.task?.length ?? 0) - (a.task?.length ?? 0));
        break;
      case "Less task":
        sorted.sort((a, b) => (a.task?.length ?? 0) - (b.task?.length ?? 0));
        break;
    }

    return sorted;
  }, [projects, sortOption]);

  /**
   * Filter the projects by the search query
   */
  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sortedProjects, searchQuery]);

  /**
   * Paginate the projects
   */
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    return filteredProjects
      .slice(startIndex, startIndex + projectsPerPage)
      .map(generateChartData);
  }, [filteredProjects, currentPage, projectsPerPage, generateChartData]);

  /**
   * Calculate the total pages
   */
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

   const projectnum = paginatedProjects.length === 0 ? true : false;
  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="container">
        <Card className="flex flex-col h-full">
          <CardHeader className="items-center">
            <CardTitle>Overall Process Board</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex items-center justify-end gap-3">
              {projectnum ? (
                ""
              ) : (
                <ModalProject createProject={handleAddProject} />
              )}
              {/* Dropdown สำหรับการกรองโปรเจค */}
              <Input
                type="text"
                placeholder="Search Project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2"
              />
              {searchQuery && (
                <Button
                  variant={"destructive"}
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </Button>
              )}

              {/* Dropdown สำหรับการเรียงลำดับ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 w-44">
                    {sortOption}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Sort A-Z", "Sort Z-A", "Most task", "Less task"].map(
                    (option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setSortOption(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* แสดง Project */}
            <div className="flex flex-wrap justify-center gap-7">
              {paginatedProjects.length === 0 ? (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-5">
                  <p className="text-2xl font-semibold">Not found Project</p>
                  <ModalProject createProject={handleAddProject} />
                </div>
              ) : (
                paginatedProjects.map((project) => (
                  <RadialChart
                    key={project.projectName}
                    projectID={project.projectId}
                    data={project.chartData}
                    config={project.chartConfig}
                    title={project.projectName}
                    value={project.doneAngle}
                    description={`Total done tasks: ${project.doneTasks}`}
                    footerText={`Total ${project.totalTasks} tasks are under this project`}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
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
  );
}
