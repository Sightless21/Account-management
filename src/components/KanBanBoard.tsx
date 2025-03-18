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

  const handleCardDrop = (itemId: string, fromColumn: string, toColumn: string, newOrder?: number) => {
    const taskToUpdate = data.find((task) => task.id === itemId);
    if (!taskToUpdate) return;

    const targetItems = data
      .filter((item) => item.status === toColumn)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const finalOrder = newOrder !== undefined ? newOrder : targetItems.length;
    const updatedTask = { ...taskToUpdate, status: toColumn as StatusTasks, order: finalOrder };

    // อัปเดตการ์ดที่ย้าย
    onUpdateStatus({ newTask: updatedTask });

    // อัปเดตลำดับของการ์ดอื่นๆ ในคอลัมน์
    const updatedItems = fromColumn === toColumn
      ? [...targetItems.filter((item) => item.id !== itemId)] // ภายในคอลัมน์
      : [...targetItems]; // ระหว่างคอลัมน์
    updatedItems.splice(finalOrder, 0, updatedTask);

    updatedItems.forEach((item, index) => {
      if (item.order !== index) {
        onUpdateStatus({ newTask: { ...item, order: index } });
      }
    });

    console.log(`Moved task ${itemId} from ${fromColumn} to ${toColumn} with order ${finalOrder}`);
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