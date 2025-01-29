import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { prisma } from "@/lib/prisma";

interface Context {
  params: {
    id: string;
  };
}
interface Document {
  id: string;
  name: string;
}

interface UpdatedDocument {
  id: string;
  name: string;
}

interface Document {
  id: string;
  name: string;
}

interface UpdatedDocument {
  id: string;
  name: string;
}

export async function PATCH(req: Request, context: Context) {
  const { id } = context.params;
  const body = await req.json();
  const {
    documents: documentNames,
    itemsMilitary,
    itemsMarital,
    itemsDwelling,
    ...otherData
  } = body;

  console.log("🔹 Other Data:", { ...otherData });

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    // ค้นหา applicant ที่ต้องการอัปเดต
    const existingApplicant = await prisma.applicant.findUnique({
      where: { id },
      include: { documents: true },
    });
    console.log("🔹 Existing Applicant:", existingApplicant);

    if (!existingApplicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 },
      );
    }

    const getDocuments = await prisma.document.findMany({
      where: { applicantId: id },
    });
    console.log("🔹 Existing Documents:", getDocuments);

    // คำนวณเอกสารที่จะลบ
    const documentsToDelete = getDocuments
      .filter((doc) => !documentNames.includes(doc.name))
      .map((doc) => doc.id);

    console.log("🔹 Documents to Delete:", documentsToDelete);

    // คำนวณเอกสารใหม่
    const newDocuments = documentNames.filter(
      (docName: string) => !getDocuments.some((doc) => doc.name === docName),
    );

    console.log("🔹 New Documents:", newDocuments);

    // คำนวณเอกสารที่ต้องอัปเดต
    const updatedDocuments: UpdatedDocument[] = documentNames
      .map((docName: string): UpdatedDocument | null => {
        const existingDoc: Document | undefined = getDocuments.find(
          (doc: Document) => doc.name === docName,
        );
        return existingDoc ? { id: existingDoc.id, name: docName } : null;
      })
      .filter(
        (doc: UpdatedDocument | null): doc is UpdatedDocument => doc !== null,
      );

    console.log("🔹 Updated Documents:", updatedDocuments);

    // ลบเอกสารที่ไม่ต้องการ
    if (documentsToDelete.length > 0) {
      await prisma.document.deleteMany({
        where: { id: { in: documentsToDelete } },
      });
      console.log("🔹 Deleted Documents:", documentsToDelete);
    }

    // อัปเดตเอกสารที่มีอยู่
    const updatePromises = updatedDocuments.map(({ id, name }) =>
      prisma.document.update({
        where: { id },
        data: { name },
      }),
    );
    await Promise.all(updatePromises);
    console.log("🔹 Updated Existing Documents");

    // เพิ่มเอกสารใหม่
    const createPromises = newDocuments.map((name: string) =>
      prisma.document.create({
        data: {
          name,
          applicantId: id,
        },
      }),
    );
    await Promise.all(createPromises);
    console.log("🔹 Created New Documents:", newDocuments);

    // อัปเดตข้อมูลอื่นของ applicant
    await prisma.applicant.update({
      where: { id },
      data: {
        ...otherData,
        itemsMilitary: Array.isArray(itemsMilitary)
          ? itemsMilitary.join(", ")
          : itemsMilitary,
        itemsMarital: Array.isArray(itemsMarital)
          ? itemsMarital.join(", ")
          : itemsMarital,
        itemsDwelling: Array.isArray(itemsDwelling)
          ? itemsDwelling.join(", ")
          : itemsDwelling,
      },
    });
    console.log("🔹 Applicant updated successfully");

    return NextResponse.json(
      { message: "Applicant updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error updating applicant:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the applicant" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, context: Context) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: "Missing ID parameter" },
      { status: 400 },
    );
  }

  console.log("🔹 Deleting applicant with ID:", id);
  try {
    // ใช้ Prisma Transaction
    await prisma.$transaction([
      // ลบเอกสารที่เกี่ยวข้อง
      prisma.document.deleteMany({
        where: {
          applicantId: id, // เชื่อมโยงกับ Axpplicant ID
        },
      }),
      // ลบ Applicant
      prisma.applicant.delete({
        where: {
          id,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Applicant and related documents deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error deleting applicant and related documents:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while deleting the applicant and related documents",
      },
      { status: 500 },
    );
  }
}
