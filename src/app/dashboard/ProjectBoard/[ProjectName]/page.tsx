"use client";
import { KanbanBoard } from "@/components/KanBanBoard"
import { TaskModal } from "@/components/Modal/modal-TaskV2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeleteTask, useProjects, useTask, useUpdateTask , useCreateTask } from "@/hooks/useProjectData";
import { useTasksUIStore } from "@/store/useTasksUIStore";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Task } from "@/types/projects"; 
import { toast } from "sonner";

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
  const { searchQuery, setSearchQuery, selectedPriority, setSelectedPriority, loading, setLoading } = useTasksUIStore();

  // ฟังก์ชันสำหรับกลับไปหน้า ProjectBoard
  async function handleProjectPage(): Promise<void> {
    router.push("/Dashboard/ProjectBoard");
  }

  const handleTaskSave = (task: Task) => {
    setLoading(true);
    if (task.id) {
      updateTaskStatus({ newTask: task }, {
        onSuccess: () => {
          setLoading(false);
          toast.success("Task updated successfully"); // Toast เดียวที่นี่
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Failed to update task: " + error.message);
        },
      });
    } else {
      createTask({ id: projectId || "", newTask: task }, {
        onSuccess: () => {
          setLoading(false);
          toast.success("Task created successfully");
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Failed to create task: " + error.message);
        },
      });
    }
  };

  // ฟิลเตอร์ tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.taskName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) || false;
      const matchesPriority = selectedPriority === " " || !selectedPriority
        ? true
        : task.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, selectedPriority]);

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
              <Input
                type="text"
                placeholder="Search Task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 h-8"
              />
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