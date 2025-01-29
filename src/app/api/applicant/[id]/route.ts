/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";

interface Document {
  id: string;
  name: string;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // ✅ ใช้งาน id ได้ถูกต้องแล้ว

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { documents: documentNames, ...otherData } = body;

    // ค้นหา applicant ที่ต้องการอัปเดต
    const existingApplicant = await prisma.applicant.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!existingApplicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    const existingDocuments = await prisma.document.findMany({
      where: { applicantId: id },
    });

    // คำนวณเอกสารที่ต้องจัดการ
    const documentsToDelete = existingDocuments
      .filter((doc) => !documentNames.includes(doc.name))
      .map((doc) => doc.id);

    const newDocuments = documentNames.filter(
      (name: string) => !existingDocuments.some((doc) => doc.name === name),
    );

    const updatedDocuments = existingDocuments
      .filter((doc) => documentNames.includes(doc.name))
      .map((doc) => ({ id: doc.id, name: doc.name }));

    // จัดการเอกสาร
    await Promise.all([
      deleteDocuments(documentsToDelete),
      updateDocuments(updatedDocuments),
      createDocuments(newDocuments, id),
    ]);

    // อัปเดต Applicant
    await prisma.applicant.update({
      where: { id },
      data: transformApplicantData(otherData),
    });

    return NextResponse.json({ message: "Applicant updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating applicant:", error);
    return NextResponse.json({ error: "An error occurred while updating the applicant" }, { status: 500 });
  }
}

// 🛠 ฟังก์ชันช่วยเหลือ
async function deleteDocuments(documentIds: string[]) {
  if (documentIds.length === 0) return;
  await prisma.document.deleteMany({
    where: { id: { in: documentIds } },
  });
}

async function updateDocuments(updatedDocuments: Document[]) {
  if (updatedDocuments.length === 0) return;
  await Promise.all(
    updatedDocuments.map(({ id, name }) =>
      prisma.document.update({ where: { id }, data: { name } }),
    ),
  );
}

async function createDocuments(newDocuments: string[], applicantId: string) {
  if (newDocuments.length === 0) return;
  await prisma.document.createMany({
    data: newDocuments.map((name) => ({ name, applicantId })),
  });
}

function transformApplicantData(data: any) {
  return {
    ...data,
    itemsMilitary: Array.isArray(data.itemsMilitary) ? data.itemsMilitary.join(", ") : data.itemsMilitary,
    itemsMarital: Array.isArray(data.itemsMarital) ? data.itemsMarital.join(", ") : data.itemsMarital,
    itemsDwelling: Array.isArray(data.itemsDwelling) ? data.itemsDwelling.join(", ") : data.itemsDwelling,
  };
}

// 🗑 DELETE Applicant
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.document.deleteMany({ where: { applicantId: id } }),
      prisma.applicant.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Applicant and related documents deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting applicant and related documents:", error);
    return NextResponse.json({ error: "An error occurred while deleting the applicant and related documents" }, { status: 500 });
  }
}