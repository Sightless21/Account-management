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
  showBurnBarrel?: boolean;
}

export const GenericBoard = <T,>({
  columns,
  items,
  statusKey,
  idKey,
  onCardDrop,
  onCardDelete,
  renderItem,
  showBurnBarrel = true,
}: GenericBoardProps<T>) => {
  return (
    <div className="w-full p-4">
      <div className="flex flex-row flex-wrap gap-4 overflow-x-auto">
        {columns.map((col) => (
          <div key={col.columnKey} className="flex-1 min-w-[250px] max-w-[350px]">
            <GenericColumn
              title={col.title}
              columnKey={col.columnKey}
              statusKey={statusKey}
              idKey={idKey}
              items={items}
              headingBgColor={col.headingBgColor}
              headingColor={col.headingColor}
              onCardDrop={onCardDrop}
              renderItem={renderItem}
            />
          </div>
        ))}
        {showBurnBarrel && (
          <div className="flex-shrink-0 min-w-[100px] max-w-[150px]">
            <BurnBarrel onDrop={onCardDelete} />
          </div>
        )}
      </div>
    </div>
  );
};