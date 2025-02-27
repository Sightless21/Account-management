// src/components/DnDApplicant/Column.tsx
"use client";
import React, { useState } from "react";
import Card from "./Card";
import { ColumnType } from "./types";
import { FormApplicant } from "@/types/applicant"
import { useUpdateApplicantStatus } from "@/hooks/useApplicantData";

interface ColumnProps {
  title: string;
  headingBgColor: string;
  headingColor: string;
  cards: FormApplicant[];
  column: ColumnType;
};

export const Column = ({
  title,
  headingColor,
  cards,
  headingBgColor,
  column,
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const { mutateAsync: updateApplicantStatus, isPending: isLoading } = useUpdateApplicantStatus()

  const handleDragStart = (
    e: React.DragEvent<Element>,
    card: FormApplicant,
    fromColumn: ColumnType
  ) => {
    e.dataTransfer.setData("cardId", card.id || "");
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

    if (fromColumn === column) return;

    try {
      await updateApplicantStatus({ id: cardId, status: column });
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
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
    <div className={`h-[550px] w-72 shrink-0 rounded-md border ${headingBgColor}`}>
      <div className={`flex items-center justify-between rounded-t-md p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="text-sm text-muted-foreground">
          Total : {filteredCards.length} {isLoading && "(Updating...)"}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-[500px] w-full overflow-auto border-t-2 border-dotted p-4 transition-colors ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => (
          <Card key={c.id} {...c} handleDragStart={(e) => handleDragStart(e, c, column)} />
        ))}
      </div>
    </div>
  );
};