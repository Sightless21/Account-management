"use client";
import { useState, DragEvent } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { useApplicantData } from "@/hooks/useApplicantData";

const BurnBarrel = () => {
  const [active, setActive] = useState(false);
  const { fetchApplicants, deleteApplicant } = useApplicantData();
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    if (!cardId) return;

    try {
      await deleteApplicant(cardId);
      console.log(`Successfully deleted applicant with ID: ${cardId}`);

      await fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid w-36 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

export default BurnBarrel;
