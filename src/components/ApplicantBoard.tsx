import { GenericBoard } from "@/components/DragAndDrop/GenericBoard";
import { GenericCard } from "@/components/DragAndDrop/GenericCard";
import { FormApplicant } from "@/types/applicant";
import { GripVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicantDialog } from "@/components/Modal/modal-Applicant";
import { Document, ApplicantStatusType } from "@/types/applicant";

interface ApplicantBoardProps {
  data: FormApplicant[];
  onUpdateStatus: (data: { id: string; status: ApplicantStatusType; order?: number }) => void;
  onDelete: (id: string) => void;
}

export const ApplicantBoard = ({ data, onUpdateStatus, onDelete }: ApplicantBoardProps) => {
  const columns = [
    { title: "Applicant", columnKey: "NEW", headingBgColor: "bg-blue-200/25 border border-blue-600", headingColor: "text-blue-600 uppercase" },
    { title: "Interview", columnKey: "PENDING_INTERVIEW", headingBgColor: "bg-yellow-200/25 border border-yellow-600", headingColor: "text-yellow-600 uppercase" },
    { title: "Passed", columnKey: "INTERVIEW_PASSED", headingBgColor: "bg-emerald-200/25 border border-emerald-600", headingColor: "text-emerald-600 uppercase" },
  ];

  const renderApplicantCard = (applicant: FormApplicant) => {
    const { documents } = applicant;
    const data = {
      ...applicant,
      documents: Array.isArray(documents) ? documents.map((doc) => (doc as unknown as Document).name || "") : [documents],
    };

    return (
      <GenericCard
        item={applicant}
        idKey="id"
        onDragStart={(e, item) => {
          e.dataTransfer.setData("cardId", item.id || "");
          e.dataTransfer.setData("fromColumn", item.status || "unknown");
        }}
        renderContent={(item) => (
          <>
            <div className="mb-2 flex w-full items-center justify-between gap-x-9 border-neutral-800 bg-neutral-800 p-2">
              <div className="flex items-start gap-2">
                <User color="white" />
                <p className="overflow-hidden text-sm text-neutral-100">{item.person.name}</p>
              </div>
              <div className="flex items-end">
                <GripVertical height={20} width={20} color="white" />
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-2 px-2 py-1">
              <div className="flex flex-1 items-center justify-center">
                <p className="text-ellipsis text-center text-sm text-muted-foreground">{item.person.position}</p>
              </div>
              <ApplicantDialog trigger={<Button variant={"link"} className="dark:text-black">Read more</Button>} applicant={data} />
            </div>
          </>
        )}
      />
    );
  };

  const handleCardDrop = (id: string, from: string, to: string, newOrder?: number) => {
    const targetItems = data
      .filter((item) => String(item.status ?? "unknown") === to)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const finalOrder = newOrder !== undefined ? newOrder : targetItems.length;
    const draggedItem = data.find((item) => item.id === id);

    // อัปเดตการ์ดที่ย้าย
    onUpdateStatus({ id, status: to as ApplicantStatusType, order: finalOrder });

    // ถ้าเป็นคอลัมน์ใหม่ ลบการ์ดจากคอลัมน์เก่าในลำดับ
    const updatedItems = from === to
      ? [...targetItems.filter((item) => item.id !== id)] // ภายในคอลัมน์เดียวกัน
      : [...targetItems]; // ระหว่างคอลัมน์

    // แทรกการ์ดที่ย้ายเข้าไปในตำแหน่งใหม่
    updatedItems.splice(finalOrder, 0, draggedItem!);

    // อัปเดตลำดับของการ์ดอื่นๆ
    updatedItems.forEach((item, index) => {
      if (item.order !== index) {
        onUpdateStatus({ id: item.id!, status: to as ApplicantStatusType, order: index });
      }
    });
  };

  return (
    <GenericBoard
      columns={columns}
      items={data}
      statusKey="status"
      idKey="id"
      onCardDrop={handleCardDrop}
      onCardDelete={onDelete}
      renderItem={renderApplicantCard}
    />
  );
};