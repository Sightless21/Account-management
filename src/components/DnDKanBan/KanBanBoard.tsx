"use client";

import React, { useEffect } from "react";
import { Board } from "./Board";
import { useTaskStore } from '@/hooks/useTaskStore';

interface KanBanBoardProps {
  projectName: string | null;
  projectID: string | null;
  searchQuery?: string | null
  selectedPriority?: string | null
  setLoading?: (loading: boolean) => void; // 🟡 ใช้ควบคุมสถานะโหลด
}

export const KanBanBoard = ({ projectName, projectID, searchQuery, selectedPriority, setLoading } : KanBanBoardProps ) => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (projectID) {
      setLoading?.(true); // 🔄 เริ่มโหลด
      fetchTasks(projectID).then(() => setLoading?.(false)); // ✅ โหลดเสร็จแล้ว
    }
  }, [projectID, fetchTasks, setLoading]);

  // 🔍 กรอง Task ตาม searchQuery และ selectedPriority
  const filteredTasks = tasks.filter(task =>
    task.projectId === projectID &&
    task.taskName.toLowerCase().includes(searchQuery ?? "".toLowerCase()) &&
    (selectedPriority === " " || task.priority === selectedPriority)
  );

  return (
    <div className="flex flex-col p-2 gap-2 w-full h-full mt-8 justify-center items-center">
      <Board data={filteredTasks} projectName={projectName} projectID={projectID} />
    </div>
  );
};
