/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { DragEvent } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdDragIndicator } from "react-icons/md";
import { ApplicantDialog } from "@/components/Modal/modal-ApplicantV2";
import { FormApplicant } from "@/types/applicant";

interface CardProps extends FormApplicant {
  handleDragStart: (e: DragEvent, card: FormApplicant) => void;
};

const Card = ({
  person,
  status,
  info,
  birthdate,
  military,
  marital,
  dwelling,
  documents,
  id,
  handleDragStart,
}: CardProps) => {
  const { name, position, email, phone, expectSalary } = person;
  const { address, nationality, religion, race } = info;

  const data = {
    person: {
      name: name || "",
      phone: phone || "",
      email: email || "",
      position: position || "",
      expectSalary: expectSalary || "",
    },
    birthdate: birthdate ? new Date(birthdate) : new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    id: id || "",
    info: {
      address: {
        houseNumber: address?.houseNumber || "",
        village: address?.village || "",
        road: address?.road || "",
        subDistrict: address?.subDistrict || "",
        district: address?.district || "",
        province: address?.province || "",
        zipCode: address?.zipCode || "",
        country: address?.country || "",
      },
      nationality: nationality || "",
      religion: religion || "",
      race: race || "",
    },
    military: military || "pass",
    marital: marital || "single",
    dwelling: dwelling || "familyHouse",
    documents: Array.isArray(documents) ? documents.map((doc: any) => doc?.name || "") : [],
    status: status || "NEW",
  };

  return (
    <motion.div
      layout
      layoutId={id}
      draggable="true"
      onDragStart={(e) => handleDragStart(e as unknown as DragEvent, { ...data, id })}
      className="mt-2 flex cursor-grab snap-center flex-col items-start justify-between rounded border border-neutral-700 bg-white hover:bg-neutral-300 active:cursor-grabbing"
      whileTap={{ scale: 1.04 }}
      whileHover={{ scale: 1.04 }}
    >
      <div className="mb-2 flex w-full items-center justify-between gap-x-9 bg-neutral-800 p-2">
        <div className="flex items-start gap-2">
          <IoPersonSharp color="white" />
          <p className="overflow-hidden text-sm text-neutral-100">{name}</p>
        </div>
        <div className="flex items-end">
          <MdDragIndicator height={25} width={25} color="white" />
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-2 py-1">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-ellipsis text-center text-sm text-muted-foreground">
            {position}
          </p>
        </div>
        <ApplicantDialog applicant={data} />
      </div>
    </motion.div>
  );
};

export default Card;
