// Card.tsx
'use client';
import React, { DragEvent } from "react";
import { motion } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { CardType } from "./types";
import { DropIndicator } from "./DropIndicator";
import ModalTask from "../modal-Task";

type CardProps = CardType & {
    projectID: string | null
    projectName: string | null
    handleDragStart: (e: DragEvent, card: CardType) => void;
};

export const Card = ({ taskName, projectName , id, status, projectID, description, priority, handleDragStart }: CardProps) => {

    const data = {
        taskName,
        id,
        status,
        description,
        priority,
        projectName: projectName 
    }
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
                onDragStart={(e) => handleDragStart(e as unknown as DragEvent, { taskName, id, status, description, priority, projectId: projectID || '' })}
                className="flex items-start flex-col mt-2 justify-between cursor-grab rounded border border-neutral-700 bg-white active:cursor-grabbing hover:bg-neutral-300 snap-center"
                whileTap={{ scale: 1.04 }}
                whileHover={{ scale: 1.04 }}
            >
                <div className="flex items-center justify-between gap-x-9 mb-2 bg-neutral-800 w-full p-2">
                    <div className="flex items-start gap-2">
                        <p className="text-sm text-neutral-100 overflow-hidden">{taskName}</p>
                    </div>
                    <div className="flex items-end">
                        <MdDragIndicator height={25} width={25} color="white" />
                    </div>
                </div>
                <div className="flex gap-2 items-center py-1 px-2 w-full">
                    <p className="flex text-sm text-muted-foreground items-end">{description}</p>
                </div>
                <div className="flex w-full justify-between items-center gap-2 p-2">
                    <Badge className="bg-slate-200">{getPriorityColor(priority)}</Badge>
                    <ModalTask mode='view' defaultValues={{ ...data, projectName: data.projectName ?? '' }} projectId={projectID} projectName={data.projectName ?? ''} />
                </div>
            </motion.div>
        </>
    );
};