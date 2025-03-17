"use client"

import { ProjectStageCard, type StageStatus } from "@/components/Project-Stage-Card"
import { useProjects } from "@/hooks/useProjectData"
import { mapBackendToProjectStages } from "@/utils/ProjectStages";

interface ProjectStage {
  id: string
  title: string
  description: string
  status: StageStatus
  startDate: Date
  endDate: Date
  progress: number
  projectId: string
}


export default function ProjectStagesDashboard() {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  console.log("Projects: ", projects)

  // ถ้ากำลังโหลดข้อมูล ให้แสดงสถานะ loading
  if (isLoadingProjects) {
    return <div className="text-center py-4">Loading projects...</div>;
  }

  // แปลงข้อมูลจาก backend เป็น ProjectStage[]
  const projectStages: ProjectStage[] = projects
    ? projects.flatMap((project) => mapBackendToProjectStages(project))
    : [];

  // ถ้าไม่มีข้อมูลจาก backend ให้แสดงข้อความ
  if (!projects || projects.length === 0) {
    return <div className="text-center py-4">No projects available.</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 overflow-x-auto whitespace-nowrap w-full pb-4">
        {projectStages.map((stage) => (
          <ProjectStageCard
            key={stage.id}
            title={stage.title}
            description={stage.description}
            status={stage.status}
            startDate={stage.startDate}
            endDate={stage.endDate}
            progress={stage.progress}
            className="hover:shadow-md transition-all duration-300 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  )
}