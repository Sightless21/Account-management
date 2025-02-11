// Column.tsx
"use client";
import React, { useState } from "react";
import { CardType, ColumnType } from "./types";
import { Card } from "./Card";
import { DropIndicator } from "./DropIndicator";
import { useUpdateTask } from "@/hooks/useProjectData";

type ColumnProps = {
  title: string;
  headingBgColor: string;
  headingColor: string;
  projectName: string | null;
  projectID: string | null;
  cards: CardType[];
  column: ColumnType;
};

export const Column = ({
  title,
  headingColor,
  cards,
  headingBgColor,
  column,
  projectName,
  projectID,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const [, setCards] = useState<CardType[]>(cards);
  const { mutateAsync: updateTask } = useUpdateTask();

  const handleDragStart = (
    e: React.DragEvent<Element>,
    card: CardType,
    fromColumn: ColumnType,
  ) => {
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.setData("fromColumn", fromColumn);
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
  
    const cardId = e.dataTransfer.getData("cardId");
    const fromColumn = e.dataTransfer.getData("fromColumn") as ColumnType;
  
    console.log("Dropped Card ID:", cardId);
    console.log("From Column:", fromColumn);
    console.log("To Column:", column);
  
    if (!cardId || !fromColumn) {
      console.warn("Card ID is missing!");
      return;
    }
  
    if (fromColumn === column) return; // ถ้าลากไปที่เดิม ไม่ต้องทำอะไร
  
    let copy = [...cards];
  
    // ค้นหาการ์ดที่ถูกลาก
    let cardToTransfer = copy.find((c) => c.id === cardId);
    if (!cardToTransfer) return;
  
    // เปลี่ยนสถานะของการ์ดให้เป็น Column ใหม่
    cardToTransfer = { ...cardToTransfer, status: column };
  
    // ลบการ์ดจาก Column เดิม
    copy = copy.filter((c) => c.id !== cardId);
  
    // เพิ่มเข้าไปที่ Column ใหม่
    copy.push(cardToTransfer);
  
    // อัพเดท Task ผ่าน API
    updateTask({
      id: cardId, // ✅ ใช้ `cardId` ของ Task
      taskName: cardToTransfer.taskName,
      status: column, // ✅ สถานะใหม่
      priority: cardToTransfer.priority,
      description: cardToTransfer.description,
    });
  
    // อัพเดท state
    setCards(copy);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.status === column);

  return (
    <div
      className={`h-[550px] w-72 shrink-0 rounded-md border ${headingBgColor}`}
    >
      <div className={`flex items-center justify-between rounded-t-md p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="text-sm text-muted-foreground">
          Total : {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-[500px] w-full overflow-auto border-t-2 border-dotted p-4 transition-colors ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => {
          return (
            <Card
              key={c.id}
              {...c}
              handleDragStart={(e) => handleDragStart(e, c, column)}
              projectID={projectID}
              projectName={projectName}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};
