"use client";
import React, { useState, DragEvent, JSX } from "react";
import { motion } from "framer-motion";

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
  const [dropIndex, setDropIndex] = useState<number | null>(null); // ตำแหน่งที่จะวาง

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

    // คำนวณตำแหน่งที่เมาส์อยู่
    const dropY = e.clientY;
    const targetItems = items
      .filter((item) => String(item[statusKey] ?? "unknown") === columnKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    let newDropIndex = targetItems.length; // ค่าเริ่มต้นคือท้ายคอลัมน์

    for (let i = 0; i < targetItems.length; i++) {
      const element = document.getElementById(`card-${String(targetItems[i][idKey])}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (dropY < rect.top + rect.height / 2) {
          newDropIndex = i;
          break;
        }
      }
    }

    setDropIndex(newDropIndex); // อัปเดตตำแหน่งของเส้น
  };

  const handleDragLeave = () => {
    setActive(false);
    setDropIndex(null); // ลบเส้นเมื่อออกจากคอลัมน์
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
    setDropIndex(null); // ลบเส้นเมื่อวาง

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
    <div className={`flex h-[650px] w-full max-w-xs flex-col rounded-md border ${headingBgColor} sm:max-w-sm md:max-w-md`}>
      <div className={`flex items-center justify-between rounded-t-md p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="text-sm text-muted-foreground">Total: {filteredItems.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative h-full w-full overflow-auto border-t-2 border-dotted p-4 transition-colors ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"}`}
      >
        {filteredItems.map((item, index) => (
          <React.Fragment key={String(item[idKey])}>
            {/* แสดงเส้นนำสายตาก่อนการ์ด ถ้าตำแหน่ง dropIndex ตรงกับ index */}
            {dropIndex === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="h-1 w-full bg-blue-500 rounded mb-2 mt-2"
                style={{ marginBottom: "8px" }}
              />
            )}
            <div id={`card-${String(item[idKey])}`}>
              {renderItem({ ...item, handleDragStart })}
            </div>
            {/* แสดงเส้นท้ายสุด ถ้า dropIndex เป็นตำแหน่งสุดท้าย */}
            {index === filteredItems.length - 1 && dropIndex === filteredItems.length && (
              <div className="h-1 w-full bg-blue-500 opacity-70 rounded" style={{ marginTop: "8px" }} />
            )}
          </React.Fragment>
        ))}
        {/* ถ้าคอลัมน์ว่างและมีการลากมา แสดงเส้น */}
        {filteredItems.length === 0 && active && (
          <div className="h-1 w-full bg-blue-500 opacity-70 rounded" />
        )}
      </div>
    </div>
  );
};