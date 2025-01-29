// BurnBarrel.tsx
"use client";
import React, { useState, DragEvent } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { useTaskStore } from "@/hooks/useTaskStore";

export const BurnBarrel = () => {
  const [active, setActive] = useState(false);
  const { deleteTask } = useTaskStore();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    if (!cardId) return;

    setActive(false);
    try {
      deleteTask(cardId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid w-36 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};
