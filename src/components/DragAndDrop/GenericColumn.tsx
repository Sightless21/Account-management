"use client";
import React, { useState, DragEvent, JSX } from "react";

interface GenericColumnProps<T extends { order?: number }> {
  title: string;
  columnKey: string;
  statusKey: keyof T;
  idKey: keyof T;
  items: T[];
  headingBgColor: string;
  headingColor: string;
  onCardDrop?: (itemId: string, fromColumn: string, toColumn: string, newOrder?: number) => void;
  renderItem: (item: T & { handleDragStart: (e: DragEvent, item: T) => void }) => JSX.Element;
}

export const GenericColumn = <T extends { order?: number }>({
  title,
  columnKey,
  statusKey,
  idKey,
  items,
  headingBgColor,
  headingColor,
  onCardDrop,
  renderItem,
}: GenericColumnProps<T>) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, item: T) => {
    const cardId = String(item[idKey]);
    const fromColumn = String(item[statusKey] ?? "unknown");
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("fromColumn", fromColumn);
    console.log("DragStart Debug:", { cardId, fromColumn, rawStatus: item[statusKey], fullItem: item });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);

    const cardId = e.dataTransfer.getData("cardId");
    const fromColumn = e.dataTransfer.getData("fromColumn");

    console.log("DragEnd Debug:", { cardId, fromColumn, toColumn: columnKey });

    if (!cardId || fromColumn === "") {
      console.log("Drag aborted: Invalid data");
      return;
    }

    const targetItems = items
      .filter((item) => String(item[statusKey] ?? "unknown") === columnKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // คำนวณตำแหน่งใหม่จากตำแหน่งเมาส์
    const dropY = e.clientY;
    let newOrder = targetItems.length;

    for (let i = 0; i < targetItems.length; i++) {
      const element = document.getElementById(`card-${String(targetItems[i][idKey])}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (dropY < rect.top + rect.height / 2) {
          newOrder = i;
          break;
        }
      }
    }

    // ถ้าเป็นคอลัมน์เดียวกันและวางในตำแหน่งเดิม ไม่ต้องทำอะไร
    const draggedItem = items.find((item) => String(item[idKey]) === cardId);
    if (fromColumn === columnKey && draggedItem && (draggedItem.order ?? 0) === newOrder) {
      console.log("Drag aborted: Same position in same column");
      return;
    }

    onCardDrop?.(cardId, fromColumn, columnKey, newOrder);
  };

  const filteredItems = items
    .filter((item) => String(item[statusKey] ?? "unknown") === columnKey)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className={`flex h-[550px] w-full max-w-xs flex-col rounded-md border ${headingBgColor} sm:max-w-sm md:max-w-md`}>
      <div className={`flex items-center justify-between rounded-t-md p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="text-sm text-muted-foreground">Total: {filteredItems.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full overflow-auto border-t-2 border-dotted p-4 transition-colors ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"}`}
      >
        {filteredItems.map((item) => (
          <div id={`card-${String(item[idKey])}`} key={String(item[idKey])}>
            {renderItem({ ...item, handleDragStart })}
          </div>
        ))}
      </div>
    </div>
  );
};