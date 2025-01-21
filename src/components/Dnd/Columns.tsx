'use client';
import React, { useState } from "react";
import Card  from "./Card";
import  DropIndicator  from "./DropIndicator";
import { CardType, ColumnType } from "./types";

type ColumnProps = {
  title: string;
  headingBgColor: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
};

export const Column = ({
  title,
  headingColor,
  cards,
  headingBgColor,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  
    const handleDragStart = (e: React.DragEvent<Element>, card: CardType) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData("cardId", card.id);
      }
    };
  
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      const cardId = e.dataTransfer ? e.dataTransfer.getData("cardId") : "";
  
      setActive(false);
      clearHighlights();
  
      const indicators = getIndicators();
      const { element } = getNearestIndicator(e, indicators);
  
      const before = element.dataset.before || "-1";
  
      if (before !== cardId) {
        let copy = [...cards];
  
        let cardToTransfer = copy.find((c) => c.id === cardId);
        if (!cardToTransfer) return;
        cardToTransfer = { ...cardToTransfer, status: column };
  
        copy = copy.filter((c) => c.id !== cardId);
  
        const moveToBack = before === "-1";
  
        if (moveToBack) {
          copy.push(cardToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === undefined) return;
  
          copy.splice(insertAtIndex, 0, cardToTransfer);
        }
  
        setCards(copy);
      }
    };
  
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      highlightIndicator(e);
  
      setActive(true);
    };
  
    const clearHighlights = (els?: HTMLElement[]) => {
      const indicators = els || getIndicators();
  
      indicators.forEach((i) => {
        i.style.opacity = "0";
      });
    };
  
    const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
      const indicators = getIndicators();
  
      clearHighlights(indicators);
  
      const el = getNearestIndicator(e, indicators);
  
      el.element.style.opacity = "1";
    };
  
    const getNearestIndicator = (e: React.DragEvent<HTMLDivElement>, indicators: HTMLElement[]) => {
      const DISTANCE_OFFSET = 50;
  
      const el = indicators.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
  
          const offset = e.clientY - (box.top + DISTANCE_OFFSET);
  
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          element: indicators[indicators.length - 1],
        }
      );
  
      return el;
    };
  
    const getIndicators = () => {
      return Array.from(
        document.querySelectorAll(
          `[data-column="${column}"]`
        ) as unknown as HTMLElement[]
      );
    };
  
    const handleDragLeave = () => {
      clearHighlights();
      setActive(false);
    };
  
    const filteredCards = cards.filter((c) => c.status === column);

  return (
    <div className={`w-72 h-[500px] shrink-0 border-4 rounded py-x-2 ${headingBgColor}`}>
      <div className={`mb-3 flex items-center justify-between p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          Total : {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-[435px] w-full transition-colors p-4 border-t-4 overflow-auto border-black border-dotted ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => (
          <Card key={c.id} {...c} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};
