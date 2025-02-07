// Card.tsx
"use client";
import React, { DragEvent } from "react";
import { motion } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { CardType } from "./types";
import { DropIndicator } from "./DropIndicator";
import { TaskModal } from "@/components/Modal/modal-Task";

type CardProps = CardType & {
  projectID: string | null;
  projectName: string | null;
  handleDragStart: (e: DragEvent, card: CardType) => void;
};

export const Card = ({
  taskName,
  id,
  status,
  projectID,
  description,
  priority,
  handleDragStart,
}: CardProps) => {
  const data = {
    taskName : taskName,
    id,
    status : status,
    description: description,
    priority : priority,
  };
  function getPriorityColor(priority: string) {
    switch (priority) {
      case "HIGH":
        return <p className="text-red-600">High</p>;
      case "MEDIUM":
        return <p className="text-yellow-600">Medium</p>;
      case "LOW":
        return <p className="text-green-600">Low</p>;
      default:
        return <p className="text-gray-600">None</p>;
    }
  }

  return (
    <>
      <DropIndicator beforeId={id} column={status} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e as unknown as DragEvent, {
            taskName,
            id,
            status,
            description,
            priority,
            projectId: projectID || "",
          })
        }
        className="mt-2 flex cursor-grab snap-center flex-col items-start justify-between rounded border border-neutral-700 bg-white hover:bg-neutral-300 active:cursor-grabbing"
        whileTap={{ scale: 1.04 }}
        whileHover={{ scale: 1.04 }}
      >
        <div className="mb-2 flex w-full items-center justify-between gap-x-9 bg-neutral-800 p-2">
          <div className="flex items-start gap-2">
            <p className="overflow-hidden text-sm text-neutral-100">
              {taskName}
            </p>
          </div>
          <div className="flex items-end">
            <MdDragIndicator height={25} width={25} color="white" />
          </div>
        </div>
        <div className="flex w-full items-center gap-2 px-2 py-1">
          <p
            className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-normal"
            style={{ wordBreak: "break-word", overflowWrap: "break-word", display: "inline" }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2 p-2">
          <Badge className="bg-slate-200">{getPriorityColor(priority)}</Badge>
          <TaskModal
            mode={"view"}
            defaultValues={{ ...data }}
            projectId={projectID}
          />
        </div>
      </motion.div>
    </>
  );
};
