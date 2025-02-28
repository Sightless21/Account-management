"use client";
import { KanbanBoard } from "@/components/KanBanBoard"
import { TaskModal } from "@/components/Modal/modal-Task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeleteTask, useProjects, useTask, useUpdateTask } from "@/hooks/useProjectData";
import { useTasksUIStore } from "@/store/useTasksUIStore";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

//DONE : Project Board page isLoading is Error
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { data: projectsData } = useProjects();
  const projectName = typeof params?.ProjectName === "string" ? decodeURIComponent(params.ProjectName) : null;
  const projectId = (projectsData?.find((project) => project.projectName === projectName))?.id ?? null;
  const { data: tasks = [] } = useTask(projectId);
  const { mutate: updateTaskStatus } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { searchQuery, setSearchQuery, selectedPriority, setSelectedPriority, loading, setLoading } = useTasksUIStore();
  async function handleProjectPage(): Promise<void> {
    router.push("/Dashboard/ProjectBoard");
  }

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="flex h-full w-full flex-col">
        <Card>
          <CardHeader className="mt-2 flex flex-row gap-3 p-2">
            <CardTitle className="flex text-2xl justify-center">Project : {projectName} Tasks {projectId ? `(${projectId})` : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ ส่งค่า searchQuery และ selectedPriority ไปยัง KanBanBoard */}
            {/* 🔍 Input สำหรับค้นหา Task */}
            <div className="flex flex-rowl gap-3 ml-4">
              {/* Features */}
              <Button variant={"outline"} className="h-8" onClick={handleProjectPage}>
                <ChevronLeft />
                Project Page
              </Button>
              <Input
                type="text"
                placeholder="Search Task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 h-8"
              />
              {/* 🏷️ Dropdown สำหรับกรอง Priority */}
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Filter Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              <TaskModal  mode="create" setLoading={setLoading} defaultValues={{
                taskName: "",
                description: "",
                priority: "LOW"
              }}
                projectId={projectId} />
            </div>
            <KanbanBoard data={tasks || []} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} />
          </CardContent>
          <CardFooter>
            <p className={loading ? "text-yellow-500" : "text-green-500"}>
              {loading ? "Loading..." : "Loaded Success"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}