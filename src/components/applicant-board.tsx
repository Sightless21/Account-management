"use client"
//GET
import React, {
  Dispatch,
  SetStateAction,
  useState,
  DragEvent,
  FormEvent,
} from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import ModalReadApplicant from "@/components/modal-readApplicant"

export const ApplicantBoard = () => {
  return (
    <div>
      <Board />
      <p className="text-sm text-muted-foreground">Loading ... & Saved Status</p>
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS); // Array

  return (
    <div className="flex gap-5 overflow-scroll top-9">
      <Column
        title="Applicant"
        column="todo"
        headingBgColor="bg-blue-200/25 border border-blue-600"
        headingColor="text-blue-600 uppercase"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress interview"
        column="doing"
        headingBgColor="bg-yellow-200/25 border border-yellow-600"
        headingColor="text-yellow-600 uppercase"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Interview pass"
        column="done"
        headingBgColor="bg-emerald-200/25 border border-emerald-600"
        headingColor="text-emerald-600 uppercase"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingBgColor: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  headingBgColor,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

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

  const handleDragOver = (e: DragEvent) => {
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

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
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

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className={`w-72 h-[500px] shrink-0 border-4 rounded py-x-2 ${headingBgColor}`}>
      <div className={`mb-3 flex items-center justify-between overflow-y-auto p-2`}>
        <h3 className={`font-medium decoration-4 ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          Total : {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-[435px] w-full transition-colors p-4 ease-in-out snap-x border-t-4 border-black border-dotted ${active ? "bg-neutral-800/20" : "bg-neutral-800/0"} overflow-y-auto`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: (e: DragEvent, card: CardType) => void;
};

const Card = ({ title, id, column, jobRole, handleDragStart }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e as unknown as DragEvent, { title, id, column, jobRole })}
        className="flex items-start flex-col justify-between cursor-grab rounded border border-neutral-700 bg-white active:cursor-grabbing hover:bg-neutral-300 snap-center"
        whileTap={{ scale: 1.04 }}
        whileHover={{ scale: 1.04 }}
      >
        <div className="flex items-center justify-between gap-x-9 mb-2 bg-neutral-800 w-full p-2">
          <div className="flex items-start gap-2">
            <IoPersonSharp color="white" />
            <p className="text-sm text-neutral-100 overflow-hidden">{title}</p>
          </div>
          <div className="flex items-end">
            <MdDragIndicator height={25} width={25} color="white" />
          </div>
        </div>
        <div className="flex gap-2 py-1 px-2 w-full">
          <p className="flex text-sm text-muted-foreground text-center">{jobRole}</p>
          <ModalReadApplicant />
        </div>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-2 w-full bg-red-900 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid w-36 shrink-0 place-content-center rounded border text-3xl ${active
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
      jobRole: "full-stack developer"
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

// card example
type ColumnType = "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
  jobRole: string;
};

const DEFAULT_CARDS: CardType[] = [
  // TODO
  {
    title: "Mr. John Doe",
    id: "1",
    column: "todo",
    jobRole: "full-stack developer"
  },
  {
    title: "Mr. John Doe",
    id: "2",
    column: "todo",
    jobRole: "full-stack developer"
  },
  {
    title: "Mrs. Jane Doe",
    id: "3",
    column: "todo",
    jobRole: "full-stack developer"
  },

  // DOING
  {
    title: "Mrs. Jane Doe",
    id: "4",
    column: "doing",
    jobRole: "full-stack developer"
  },
  {
    title: "Mr. John Doe",
    id: "5",
    column: "doing",
    jobRole: "full-stack developer"
  },
  // DONE
  {
    title: "นาย ภานุพงศ์ สุวรรณพงศ์",
    id: "6",
    column: "done",
    jobRole: "full-stack developer"
  },
];