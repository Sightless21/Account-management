"use client";

import React from "react";
import { GenericBoard } from "./DragAndDrop/GenericBoard";
import { GenericCard } from "./DragAndDrop/GenericCard";
import { StatusTasks, Task } from "@/types/projects";
import { UseMutateFunction } from "@tanstack/react-query";
import { TaskCard } from "@/components/task-card";

interface KanbanBoardProps {
  data: Task[];
  onUpdateStatus: UseMutateFunction<void, Error, { newTask: Task }, { previousTasks: Task[] | undefined }>;
  onDelete: UseMutateFunction<void, Error, string, { previousTasks: Task[] | undefined }>;
}

export const KanbanBoard = ({ data, onUpdateStatus, onDelete }: KanbanBoardProps) => {
  const columns = [
    {
      title: "TODO",
      columnKey: "TODO",
      headingBgColor: "bg-gray-200/25 border border-gray-600 dark:border-gray-400 dark:bg-gray-800",
      headingColor: "text-gray-600 uppercase",
    },
    {
      title: "DOING",
      columnKey: "DOING",
      headingBgColor: "bg-blue-200/25 border border-blue-600",
      headingColor: "text-blue-600 uppercase",
    },
    {
      title: "DONE",
      columnKey: "DONE",
      headingBgColor: "bg-emerald-200/25 border border-emerald-600",
      headingColor: "text-emerald-600 uppercase",
    },
  ];

  const handleCardDrop = (itemId: string, fromColumn: string, toColumn: string) => {
    const taskToUpdate = data.find((task) => task.id === itemId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: toColumn as StatusTasks };
      onUpdateStatus({ newTask: updatedTask });
      console.log(`Moved task ${itemId} from ${fromColumn} to ${toColumn}`);
    }
  };

  const handleCardDelete = (itemId: string) => {
    onDelete(itemId);
    console.log(`Deleted task ${itemId}`);
  };

  const renderKanBanCard = (item: Task) => (
    <GenericCard
      item={item}
      idKey="id"
      onDragStart={(e, item) => {
        e.dataTransfer.setData("cardId", item.id || "");
        e.dataTransfer.setData("fromColumn", item.status || "unknown");
      }}
      renderContent={(task: Task) => (
        <TaskCard
          task={task}
          onDragStart={(e, task) => {
            e.dataTransfer.setData("cardId", task.id);
            e.dataTransfer.setData("fromColumn", task.status);
          }}
        />
      )}
    />
  );

  return (
    <GenericBoard
      columns={columns}
      items={data}
      statusKey="status"
      idKey="id"
      onCardDrop={handleCardDrop}
      onCardDelete={handleCardDelete}
      renderItem={renderKanBanCard}
    />
  );
};