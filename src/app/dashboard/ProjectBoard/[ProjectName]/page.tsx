"use client";
import { KanbanBoard } from "@/components/KanBanBoard"
import { TaskModal } from "@/components/Modal/modal-Task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteTask, useProjects, useTask, useUpdateTask, useCreateTask } from "@/hooks/useProjectData";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Task } from "@/types/projects";
import { toast } from "sonner";
import { FilterComponent } from "@/components/DragAndDrop/FilterDnD";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { data: projectsData } = useProjects();
  const projectName = typeof params?.ProjectName === "string" ? decodeURIComponent(params.ProjectName) : null;
  const projectId = projectsData?.find((project) => project.projectName === projectName)?.id ?? null;
  const { data: tasks = [] } = useTask(projectId);
  const { mutate: updateTaskStatus } = useUpdateTask();
  const { mutate: createTask } = useCreateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  const handleFilterChange = (filteredData: Task[]) => {
    setFilteredTasks(filteredData);
  };
  // ฟังก์ชันสำหรับกลับไปหน้า ProjectBoard
  async function handleProjectPage(): Promise<void> {
    router.push("/Dashboard/ProjectBoard");
  }

  const handleTaskSave = (task: Task) => {
    if (task.id) {
      updateTaskStatus({ newTask: task }, {
        onSuccess: () => {
          toast.success("Task updated successfully");
        },
        onError: (error) => {
          toast.error("Failed to update task: " + error.message);
        },
      });
    } else {
      createTask({ id: projectId || "", newTask: task }, {
        onSuccess: () => {
          toast.success("Task created successfully");
        },
        onError: (error) => {
          toast.error("Failed to create task: " + error.message);
        },
      });
    }
  };

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="flex h-full w-full flex-col">
        <Card>
          <CardHeader className="mt-2 flex flex-row gap-3 p-2">
            <CardTitle className="flex text-2xl justify-center">
              Project : {projectName} Tasks {projectId ? `(${projectId})` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-3 ml-4">
              <Button variant={"outline"} className="h-8" onClick={handleProjectPage}>
                <ChevronLeft />
                Project Page
              </Button>
              <FilterComponent
                data={tasks}
                searchKey="taskName"
                searchPlaceholder="Search Task name..."
                filterKey="priority"
                filterOptions={["HIGH", "MEDIUM", "LOW"]}
                onFilterChange={handleFilterChange}
                filterLabel="Priority"
              />
              {/* TaskModal สำหรับสร้าง task ใหม่ */}
              <TaskModal
                mode="create"
                defaultValues={{
                  id: "",
                  projectId: projectId || "",
                  taskName: "",
                  description: "",
                  dueDate: new Date(),
                  priority: "LOW",
                  status: "TODO",
                  assignee: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  order: 0
                }}
                onSave={handleTaskSave}
                projectId={projectId}
              />
            </div>
            {/* KanbanBoard พร้อมตัวอย่างการส่ง TaskModal สำหรับ view-edit */}
            <KanbanBoard
              data={filteredTasks}
              onUpdateStatus={updateTaskStatus}
              onDelete={deleteTask}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}