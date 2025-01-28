"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from "lucide-react";
import { ModalProject } from "@/components/modal-project";
import { RadialChart } from "@/components/radialchart-text";
import { useProjectStore } from "@/hooks/useProjectStore";

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

export default function Page() {
  const { projects, fetchProjects, addProject, deleteProject, updateProject } =
    useProjectStore();
  // const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    // ดึงข้อมูลโปรเจกต์เมื่อ component ถูก mount
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  const handleUpdateProject = async (id: string) => {
    const updatedProject = {
      id,
      projectName: "Updated Project Name",
      task: [],
    };
    await updateProject(id, updatedProject);
  };

  const handleAddProject = async (projectName: string) => {
    const newProject = {
      id:"",
      projectName: projectName,
      task: [],
    };
    await addProject(newProject);
  };


  // Generate chart data for each project
  const generateChartData = useCallback((project: Project): ChartData => {
    const doneTasks = project.task?.filter((task) => task.status === "done").length;
    const totalTasks = project.task?.length;
    const donePercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
    const doneAngle = (donePercentage * 360) / 100;

    return {
      projectName: project.projectName,
      chartData: [
        {
          name: "Done Tasks",
          value: donePercentage,
          fill: "var(--color-done)",
        },
      ],
      chartConfig: {
        value: { label: "Done" },
      },
      donePercentage,
      doneAngle,
      totalTasks,
      doneTasks,
    };
  }, []);

  // Filter and paginate projects
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) => !selectedProject || project.projectName === selectedProject
    );
  }, [projects, selectedProject]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return filteredProjects.slice(startIndex, endIndex).map(generateChartData);
  }, [filteredProjects, currentPage, projectsPerPage, generateChartData]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="flex flex-col gap-4 ml-3 mr-3">
      <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
        Project Board
      </div>
      <div className="container">
        <Card className="flex flex-col">
          <CardHeader className="items-center">
            <CardTitle>Overall Process Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="container flex justify-end gap-4">
              <div className="flex gap-3 justify-end mb-4">
                <ModalProject createProject={handleAddProject} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {selectedProject || "Filter by Project"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedProject(null)}>
                      All Projects
                    </DropdownMenuItem>
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => setSelectedProject(project.projectName)}
                      >
                        {project.projectName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Radial Charts */}
            <div className="flex flex-wrap justify-center gap-7">
              {paginatedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-96">
                  <p className="text-2xl font-semibold">Please create a project</p>
                  <ModalProject createProject={handleAddProject}/>
                </div>
              ) : (
                paginatedProjects.map((project) => (
                  <RadialChart
                    key={project.projectName}
                    data={project.chartData}
                    config={project.chartConfig}
                    title={project.projectName}
                    projectName={project.projectName}
                    value={project.doneAngle}
                    description={`Total done tasks: ${project.doneTasks}`}
                    footerText={`Total ${project.totalTasks} tasks are under this project`}
                  />
                ))
              )}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-4">
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
