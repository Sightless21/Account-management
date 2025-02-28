'use client'

import React from "react";
import { GenericBoard } from "./DragAndDrop/GenericBoard";
import { GenericCard } from "./DragAndDrop/GenericCard";
import { StatusTasks, Task } from "@/types/projects";
// import { MdDragIndicator } from "react-icons/md";
// import { Badge } from "./ui/badge";
// import { TaskModal } from "./Modal/modal-Task";
import { UseMutateFunction } from "@tanstack/react-query";
import { TaskCard } from "@/components/task-card"

interface KanbanBoardProps {
  data: Task[];
  onUpdateStatus: UseMutateFunction<void, Error, Task, { previousTasks: Task[] | undefined }>;
  onDelete: UseMutateFunction<void, Error, string, { previousTasks: Task[] | undefined }>;
}

export const KanbanBoard = ({ data, onUpdateStatus, onDelete }: KanbanBoardProps) => {
  // function getPriorityColor(priority: string) {
  //   switch (priority) {
  //     case "HIGH":
  //       return <p className="text-red-600">High</p>;
  //     case "MEDIUM":
  //       return <p className="text-yellow-600">Medium</p>;
  //     case "LOW":
  //       return <p className="text-green-600">Low</p>;
  //     default:
  //       return <p className="text-gray-600">None</p>;
  //   }
  // }

  const columns = [
    {
      title: "TODO",
      columnKey: "TODO",
      headingBgColor: "bg-blue-200/25 border border-blue-600",
      headingColor: "text-blue-600 uppercase"
    },
    {
      title: "DOING",
      columnKey: "DOING",
      headingBgColor: "bg-yellow-200/25 border border-yellow-600",
      headingColor: "text-yellow-600 uppercase"
    },
    {
      title: "DONE",
      columnKey: "DONE",
      headingBgColor: "bg-emerald-200/25 border border-emerald-600",
      headingColor: "text-emerald-600 uppercase"
    },
  ];

  const handleCardDrop = (itemId: string, fromColumn: string, toColumn: string) => {
    const taskToUpdate = data.find(task => task.id === itemId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status: toColumn as StatusTasks };
      onUpdateStatus(updatedTask);
    }
    console.log(`Moved task ${itemId} from ${fromColumn} to ${toColumn}`);
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
      renderContent={(task) => (
        <TaskCard task={{ ...task, title: task.taskName, priority: task.priority as "HIGH" | "MEDIUM" | "LOW" }}
        onDragStart={(e, task) => {
          e.dataTransfer.setData("cardId", task.id)
          e.dataTransfer.setData("fromColumn", task.status)
        }}/>
        // <div>
        //   <div className="mb-2 flex w-full items-center justify-between gap-x-9 bg-neutral-800 p-2">
        //     <div className="flex items-start gap-2">
        //       <p className="overflow-hidden text-sm text-neutral-100">{task.taskName}</p>
        //     </div>
        //     <div className="flex items-end">
        //       <MdDragIndicator height={25} width={25} color="white" />
        //     </div>
        //   </div>
        //   <div className="flex w-full items-center gap-2 px-2 py-1">
        //     <p
        //       className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-normal"
        //       style={{ wordBreak: "break-word", overflowWrap: "break-word", display: "inline" }}
        //       dangerouslySetInnerHTML={{ __html: item.description || "" }}
        //     />
        //   </div>
        //   <div className="flex w-full items-center justify-between gap-2 p-2">
        //     <Badge className="bg-slate-200 ">{getPriorityColor(item.priority)}</Badge>
        //     <TaskModal mode={"view"} defaultValues={item} projectId={item.projectId} />
        //   </div>
        // </div>
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
      showBurnBarrel={true}
    />
  );
};