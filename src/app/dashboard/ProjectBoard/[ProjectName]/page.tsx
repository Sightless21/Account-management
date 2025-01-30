"use client";
import { KanBanBoard } from "@/components/DnDKanBan/KanBanBoard";
import { useProjectStore } from "@/hooks/useProjectStore";
import ModalTask from "@/components/Modal/modal-Task";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const projectName =
    typeof params?.ProjectName === "string"
      ? decodeURIComponent(params.ProjectName)
      : null;
  const { projects, fetchProjects } = useProjectStore();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 ค้นหา Task
  const [selectedPriority, setSelectedPriority] = useState(" "); // 🏷️ เลือก Priority
  const [loading, setLoading] = useState(false); // 🟡 สถานะโหลด

  useEffect(() => {
    setLoading(true); // เริ่มโหลด
    toast.promise(fetchProjects().then(() => setLoading(false)), {
      loading: "Loading data...",
      success: "Data loaded successfully",
      error: "Failed to load data",
    })
  }, [fetchProjects]);

  useEffect(() => {
    // หาว่า ProjectName ตรงกับโปรเจกต์ใด และตั้งค่า ProjectId
    if (projectName && projects.length > 0) {
      const matchedProject = projects.find(
        (project) => project.projectName === projectName,
      );
      if (matchedProject) {
        setProjectId(matchedProject.id);
        console.log("Matched Project ID:", matchedProject.id);
      } else {
        console.warn("No project found with the name:", projectName);
      }
    }
  }, [projectName, projects]);

  async function handleProjectPage() {
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
                  <SelectItem value="LOW">Low </SelectItem>
                </SelectContent>
              </Select>
              <ModalTask
                mode="create"
                projectId={projectId}
                projectName={projectName || undefined}
                defaultValues={{
                  projectName: projectName || "",
                  taskName: "",
                  description: "",
                }}
                setLoading={setLoading} // 🟡 ส่งไปใช้ตอนสร้าง Task
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* ✅ ส่งค่า searchQuery และ selectedPriority ไปยัง KanBanBoard */}
            <KanBanBoard
              projectID={projectId}
              projectName={projectName}
              searchQuery={searchQuery}
              selectedPriority={selectedPriority}
              setLoading={setLoading} // 🟡 ส่งไปใช้ตอนสร้าง Task
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
