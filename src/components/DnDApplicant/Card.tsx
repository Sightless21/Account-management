"use client";
import { motion } from "framer-motion";
import { DragEvent } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdDragIndicator } from "react-icons/md";
import ModalApplicant from "@/components/modal-Applicant";
import { CardType } from "./types";

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
};

const Card = ({
  person,
  status,
  info,
  birthdate,
  itemsMilitary,
  itemsMarital,
  itemsDwelling,
  documents,
  id,
  handleDragStart,
}: CardProps) => {
  // console.log("🚀 ~ file: Card.tsx:19 ~ Card ~ person:", person)
  const { name, position, email, phone, expectSalary } = person;
  const { address, nationality, religion, race } = info;

  const data = {
    person: {
      name: name,
      phone: phone,
      email: email,
      position: position,
      expectSalary: expectSalary,
    },
    id,
    info: {
      address: {
        houseNumber: address.houseNumber,
        village: address.village,
        road: address.road,
        subDistrict: address.subDistrict,
        district: address.district,
        province: address.province,
        zipCode: address.zipCode,
        country: address.country,
      },
      nationality: nationality,
      religion: religion,
      race: race,
    },
    birthdate: new Date(birthdate),
    itemsMilitary: Array.isArray(itemsMilitary)
      ? itemsMilitary
      : [itemsMilitary],
    itemsMarital: Array.isArray(itemsMarital) ? itemsMarital : [itemsMarital],
    itemsDwelling: Array.isArray(itemsDwelling)
      ? itemsDwelling
      : [itemsDwelling],
    documents: documents.map((doc) => doc.name) || [],
    status,
  };

  return (
    <motion.div
      layout
      layoutId={id}
      draggable="true"
      onDragStart={(e) =>
        handleDragStart(e as unknown as DragEvent, {
          person: {
            name: "",
            phone: "",
            email: "",
            position: "",
            expectSalary: "",
          },
          id,
          info: {
            address: {
              houseNumber: "",
              village: "",
              road: "",
              subDistrict: "",
              district: "",
              province: "",
              zipCode: "",
              country: "",
            },
            nationality: "",
            religion: "",
            race: "",
          },
          birthdate: "",
          itemsMilitary: "",
          itemsMarital: "",
          itemsDwelling: "",
          status,
          documents: [],
        })
      }
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
        <ModalApplicant mode="view" defaultValues={data} />
      </div>
    </motion.div>
  );
};

export default Card;
