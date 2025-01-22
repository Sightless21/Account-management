/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import { CardType, ColumnType } from "./types";
import axios from "axios";
import { useApplicantStore } from "@/hooks/useApplicantStore"; // นำเข้า Zustand Store


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
  const { fetchApplicants , updateApplicantStatus } = useApplicantStore();

  const handleDragStart = (e: React.DragEvent<Element>, card: CardType, fromColumn: ColumnType) => {
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.setData("fromColumn", fromColumn);
    console.log("🚀 ~ file: Columns.tsx:64 ~ handleDragStart ~ card ID :", card.id);
    console.log("🚀 ~ file: Columns.tsx:65 ~ handleDragStart ~ fromColumn :", fromColumn);

  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {

    e.preventDefault();
    setActive(false);
    clearHighlights();

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

    // อัปเดต State
    updateApplicantStatus(cardId, column);

    console.log("🚀 ~ file: Columns.tsx:108 ~ handleDragEnd ~ copy", copy);

    // 🔥 ยิง API อัปเดตสถานะ
    try {
      await axios.patch("/api/applicant", { id: cardId, status: column });
      await fetchApplicants(); // อัปเดต Zustand ทันที
    } catch (error) {
      console.error("❌ Error updating status:", error);
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
          <Card key={c.id} {...c} handleDragStart={(e) => handleDragStart(e, c, column)} />
        ))}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};
