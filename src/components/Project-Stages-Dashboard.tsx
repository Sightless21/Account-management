"use client"

import { ProjectStageCard, type StageStatus } from "@/components/Project-Stage-Card"

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
  const projectStages: ProjectStage[] = [
    {
      id: "stage1",
      title: "Research & Planning",
      description: "Initial research, requirements gathering, and project planning",
      status: "completed",
      startDate: new Date("2025-01-10"),
      endDate: new Date("2025-01-25"),
      progress: 100,
      projectId: "project1",
    },
    {
      id: "stage2",
      title: "Design Phase",
      description: "UI/UX design, wireframing, and prototyping",
      status: "in-progress",
      startDate: new Date("2025-01-26"),
      endDate: new Date("2025-02-15"),
      progress: 65,
      projectId: "project1",
    },
    {
      id: "stage3",
      title: "Development",
      description: "Frontend and backend implementation",
      status: "not-started",
      startDate: new Date("2025-02-16"),
      endDate: new Date("2025-03-20"),
      progress: 0,
      projectId: "project1",
    },
    {
      id: "stage4",
      title: "Testing",
      description: "QA testing, bug fixes, and performance optimization",
      status: "blocked",
      startDate: new Date("2025-03-21"),
      endDate: new Date("2025-04-05"),
      progress: 0,
      projectId: "project1",
    },
    {
      id: "stage5",
      title: "Market Research",
      description: "Competitor analysis and user research",
      status: "completed",
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-01-20"),
      progress: 100,
      projectId: "project2",
    },
    {
      id: "stage6",
      title: "Wireframing",
      description: "Creating app wireframes and user flows",
      status: "completed",
      startDate: new Date("2025-01-21"),
      endDate: new Date("2025-02-10"),
      progress: 100,
      projectId: "project2",
    },
    {
      id: "stage7",
      title: "UI Design",
      description: "Creating visual designs and prototypes",
      status: "in-progress",
      startDate: new Date("2025-02-11"),
      endDate: new Date("2025-03-01"),
      progress: 75,
      projectId: "project2",
    },
  ]

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

