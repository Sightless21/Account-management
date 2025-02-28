'use client'
import React from "react";
import { KanbanBoard } from "@/components/KanBanBoard"
import { useTask, useUpdateTask, useDeleteTask, useProjects } from "@/hooks/useProjectData";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const projectName =
    typeof params?.ProjectName === "string"
      ? decodeURIComponent(params.ProjectName)
      : null;

  const { data: projectsData } = useProjects();
  const projectId = (projectsData?.find((project) => project.projectName === projectName))?.id ?? null;
  const { data: tasks = [] } = useTask(projectId);
  const { mutate: updateApplicantStatus } = useUpdateTask();
  const { mutate: deleteApplicant } = useDeleteTask();


  return (
    <div>
      <KanbanBoard data={tasks || []} onUpdateStatus={updateApplicantStatus} onDelete={deleteApplicant} />
    </div>
  );
}