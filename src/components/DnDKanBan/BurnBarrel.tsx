"use client";

import React, { useState, DragEvent } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTask } from "@/hooks/useProjectData";

export const BurnBarrel = () => {
  const [active, setActive] = useState(false);
  const {mutateAsync } = useDeleteTask(); // ✅ ดึง mutateAsync ออกมา
  const queryClient = useQueryClient();

  // การจัดการ drag events
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) return; // ถ้าไม่มี cardId จะไม่ทำอะไร

    setActive(false);

    // ลบ task ที่ถูกลากมาทิ้ง
    try {
      await toast.promise(mutateAsync(cardId), { // ✅ ใช้ mutateAsync ที่ถูกต้อง
        loading: "Deleting task...",
        success: "Task deleted successfully!",
        error: "Error deleting task",
      });
  
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // ✅ รีเฟรชข้อมูลหลังลบ
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid w-36 shrink-0 place-content-center rounded border text-3xl ${active
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};