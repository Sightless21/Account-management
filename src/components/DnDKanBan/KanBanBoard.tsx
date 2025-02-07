"use client";

import React from "react";
import { Board } from "./Board";
import { useTasksUIStore } from "@/store/useTasksUIStore";
import { useTask } from "@/hooks/useProjectData";

interface KanBanBoardProps {
  projectName: string | null;
  projectID: string | null;
}

export const KanBanBoard = ({ projectName, projectID }: KanBanBoardProps) => {
  // Zustand store สำหรับ UI state
  const { searchQuery, selectedPriority } = useTasksUIStore();

  // ✅ ใช้ projectID เพื่อดึง tasks เฉพาะของ project นั้น
  const { data: tasks = [], isLoading } = useTask(projectID);

  console.log("Tasks:", tasks);

  // 🔍 กรอง Task ตาม searchQuery และ selectedPriority
  const filteredTasks = tasks.filter((task) => {
    return (
      task.taskName.toLowerCase().includes(searchQuery?.toLowerCase() ?? "") &&
      (selectedPriority === " " || task.priority === selectedPriority)
    );
  });

  return (
    <div className="mt-8 flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      {isLoading ? (
        <p>Loading tasks...</p> // ✅ แสดงข้อความโหลด
      ) : (
        <Board data={filteredTasks} projectName={projectName} projectID={projectID} />
      )}
    </div>
  );
};