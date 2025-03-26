"use client";
import React, { DragEvent, JSX } from "react";
import { motion } from "framer-motion";

interface GenericCardProps<T> {
  item: T;
  idKey: keyof T;
  onDragStart: (e: DragEvent, item: T) => void;
  renderContent: (item: T) => JSX.Element;
  className?: string;
}

export const GenericCard = <T,>({
  item,
  idKey,
  onDragStart,
  renderContent,
  className = "",
}: GenericCardProps<T>) => {
  return (
    <motion.div
      layout
      layoutId={String(item[idKey])}
      id={`card-${String(item[idKey])}`}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as DragEvent, item)}
      className={`mt-2 flex cursor-grab snap-center flex-col items-start justify-between rounded border dark:border-white border-neutral-700 bg-white hover:bg-neutral-300 active:cursor-grabbing ${className}`}
      whileTap={{ scale: 1.03 }}
      whileHover={{ scale: 1.03 }}
    >
      {renderContent(item)}
    </motion.div>
  );
};