"use client";
import { KanbanBoard } from "@/components/KanBanBoard"
import { TaskModal } from "@/components/Modal/modal-TaskV2"; // อัปเดต path ให้ตรงกับโครงสร้างของคุณ
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeleteTask, useProjects, useTask, useUpdateTask } from "@/hooks/useProjectData";
import { useTasksUIStore } from "@/store/useTasksUIStore";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Task } from "@/types/projects"; // ตรวจสอบ path ให้ถูกต้อง

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { data: projectsData } = useProjects();
  const projectName = typeof params?.ProjectName === "string" ? decodeURIComponent(params.ProjectName) : null;
  const projectId = projectsData?.find((project) => project.projectName === projectName)?.id ?? null;
  const { data: tasks = [] } = useTask(projectId);
  const { mutate: updateTaskStatus } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { searchQuery, setSearchQuery, selectedPriority, setSelectedPriority, loading, setLoading } = useTasksUIStore();

  // ฟังก์ชันสำหรับกลับไปหน้า ProjectBoard
  async function handleProjectPage(): Promise<void> {
    router.push("/Dashboard/ProjectBoard");
  }

  // ฟังก์ชันสำหรับบันทึก task (ทั้ง create และ update)
  const handleTaskSave = (task: Task) => {
    setLoading(true);
    // ตัวอย่างการจำลองการบันทึก task (ควรแทนที่ด้วย API call จริง)
    console.log("Task saved:", task);
    if (task.id.startsWith("task-")) {
      // กรณีสร้าง task ใหม่ (id ถูกสร้างจาก `task-${Date.now()}`)
      // ตัวอย่าง: เรียก API สร้าง task
    } else {
      // กรณีอัปเดต task ที่มีอยู่
      updateTaskStatus(task);
    }
    setTimeout(() => setLoading(false), 500); // จำลองการโหลด
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