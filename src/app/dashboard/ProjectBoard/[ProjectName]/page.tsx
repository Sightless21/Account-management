"use client";
import { KanBanBoard } from "@/components/DnDKanBan/KanBanBoard";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { TaskModal } from "@/components/Modal/modal-Task";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// Import Zustand store
import { useTasksUIStore } from "@/store/useTasksUIStore";
import { useProjects } from "@/hooks/useProjectData"

//DONE : Project Board page isLoading is Error
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const projectName =
    typeof params?.ProjectName === "string"
      ? decodeURIComponent(params.ProjectName)
      : null;

  // Zustand store states for UI
  const { searchQuery, setSearchQuery, selectedPriority, setSelectedPriority, loading, setLoading } = useTasksUIStore();
  const { data: projectsData } = useProjects();
  
  // Set projectId after fetching projects
  const projectId = (projectsData?.find((project) => project.projectName === projectName))?.id ?? null;

  // Handle redirect back to Project page
  async function handleProjectPage(): Promise<void> {
    router.push("/dashboard/ProjectBoard");
  }

  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="mr-3 flex scroll-m-20 items-center justify-between border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Project : {projectName} Tasks {projectId ? `(${projectId})` : ""}
      </div>
      <div className="flex h-full w-full flex-col">
        <Card>
          <CardHeader className="mt-2 flex flex-row gap-3 p-2">
            <div className="ml-6 flex flex-row gap-3">
              {/* Features */}
              <Button variant={"outline"} onClick={handleProjectPage}>
                <ChevronLeft />
                Project Page
              </Button>
              {/* 🔍 Input สำหรับค้นหา Task */}
              <Input
                type="text"
                placeholder="Search Task name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 px-3 py-2"
              />
              {/* 🏷️ Dropdown สำหรับกรอง Priority */}
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
              <TaskModal mode="create" setLoading={setLoading} defaultValues={{
                  taskName: "",
                  description: "",
                  priority:"LOW"
                }}
                projectId={projectId}/>
            </div>
          </CardHeader>
          <CardContent>
            {/* ✅ ส่งค่า searchQuery และ selectedPriority ไปยัง KanBanBoard */}
            <KanBanBoard
              projectID={projectId}
              projectName={projectName}
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