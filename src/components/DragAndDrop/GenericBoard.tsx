// GenericBoard.tsx
"use client";
import React ,{ JSX} from "react";
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
    <div className="flex gap-1 p-2">
      {columns.map((col) => (
        <GenericColumn
          key={col.columnKey}
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
      ))}
      {showBurnBarrel && <BurnBarrel onDrop={onCardDelete} />}
    </div>
  );
};