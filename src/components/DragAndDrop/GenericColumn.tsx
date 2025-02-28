// GenericColumn.tsx
"use client";
import React, { useState, DragEvent, JSX } from "react";

interface GenericColumnProps<T> {
  title: string;
  columnKey: string;
  statusKey: keyof T;
  idKey: keyof T;
  items: T[];
  headingBgColor: string;
  headingColor: string;
  onCardDrop?: (itemId: string, fromColumn: string, toColumn: string) => void;
  renderItem: (item: T & { handleDragStart: (e: DragEvent, item: T) => void }) => JSX.Element;
}

export const GenericColumn = <T,>({
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
    const fromColumn = String(item[statusKey] ?? "unknown"); // Default เป็น "unknown" ถ้าไม่มีค่า
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("fromColumn", fromColumn);

    console.log("DragStart Debug:");
    console.log(" - cardId:", cardId);
    console.log(" - fromColumn:", fromColumn);
    console.log(" - raw status:", item[statusKey]);
    console.log(" - full item:", item);
    
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

    console.log("DragEnd Debug:");
    console.log(" - cardId:", cardId);
    console.log(" - fromColumn:", fromColumn);
    console.log(" - toColumn:", columnKey);
    
    if (!cardId || fromColumn === "" || fromColumn === columnKey) {
      console.log("Drag aborted: Invalid data or same column");
      return;
    }

    onCardDrop?.(cardId, fromColumn, columnKey);
  };

  const filteredItems = items.filter(
    (item) => String(item[statusKey] ?? "unknown") === columnKey
  );

  return (
    <div className={`h-[550px] w-72 shrink-0 rounded-md border ${headingBgColor}`}>
      <div className={`flex items-center justify-between rounded-t-md p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="text-sm text-muted-foreground">
          Total: {filteredItems.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-[500px] w-full overflow-auto border-t-2 border-dotted p-4 transition-colors ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"
          }`}
      >
        {filteredItems.map((item) => (
          <React.Fragment key={String(item[idKey])}>
            {renderItem({ ...item, handleDragStart })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};