"use client";
import React, { JSX } from "react";
import { GenericColumn } from "./GenericColumn";
import { BurnBarrel } from "./BurnBarrel";

interface ColumnConfig {
  title: string;
  columnKey: string;
  headingBgColor: string;
  headingColor: string;
}

interface GenericBoardProps<T> {
  columns: ColumnConfig[];
  items: T[];
  statusKey: keyof T;
  idKey: keyof T;
  onCardDrop?: (itemId: string, fromColumn: string, toColumn: string) => void;
  onCardDelete?: (itemId: string) => void;
  renderItem: (item: T) => JSX.Element;
}

export const GenericBoard = <T,>({
  columns,
  items,
  statusKey,
  idKey,
  onCardDrop,
  onCardDelete,
  renderItem,
}: GenericBoardProps<T>) => {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-4">
        {/* คอลัมน์ทั้งหมดในแนวนอน */}
        <div className="flex flex-row flex-wrap gap-4 overflow-x-auto">
          {columns.map((col) => (
            <div key={col.columnKey} className="flex-1 min-w-[250px] max-w-[350px] h-full">
              <GenericColumn
                title={col.title}
                columnKey={col.columnKey}
                statusKey={statusKey}
                idKey={idKey}
                items={items}
                headingBgColor={col.headingBgColor}
                headingColor={col.headingColor}
                onCardDrop={onCardDrop}
                renderItem={(item) => renderItem(item)}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <div className="w-full">
            <BurnBarrel onDrop={onCardDelete} isHorizontal={true} />
          </div>
        </div>
      </div>
    </div>
  );
};