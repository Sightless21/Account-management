/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 📌 นำเข้า Prisma Client

//DONE : Applicant endpoint 
export async function POST({ request }: { request: Request; }) {
  try {
    const data = await request.json();
    console.log("📌 Received Body:", data);
    if (!request.body) {
      console.error("❌ No payload received.");
      return NextResponse.json(
        { error: "No payload received" },
        { status: 400 },
      );
    }
    // ตรวจสอบว่า body มีค่าหรือไม่ และมี properties ที่ต้องการ
    if (!data || !data.documents || !Array.isArray(data.documents)) {
      throw new Error("Missing or invalid documents array");
    }
    const createApplicant = await prisma.applicant.create({
      data: {
        person: {
          name: data.person.name,
          phone: data.person.phone,
          email: data.person.email,
          position: data.person.position,
          expectSalary: data.person.expectSalary,
        },
        birthdate: new Date(data.birthdate),
        info: {
          address: {
            houseNumber: data.info.address.houseNumber,
            village: data.info.address.village,
            road: data.info.address.road,
            subDistrict: data.info.address.subDistrict,
            district: data.info.address.district,
            province: data.info.address.province,
            zipCode: data.info.address.zipCode,
            country: data.info.address.country,
          },
          nationality: data.info.nationality,
          religion: data.info.religion,
          race: data.info.race,
        },
        itemsDwelling: data.itemsDwelling[0],
        itemsMarital: data.itemsMarital[0],
        itemsMilitary: data.itemsMilitary[0],
        documents:
          data.documents.length > 0
            ? { create: data.documents.map((doc: any) => ({ name: doc })) }
            : undefined, // ✅ ป้องกัน `undefined.map()`
        status: data.status || "NEW",
      },
    });
    console.log("createApplicant:", createApplicant);

    if (!createApplicant) {
      throw new Error("createApplicant is null or undefined.");
    }
    return NextResponse.json(createApplicant, { status: 202 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating applicant: ", error.message || error);
      return NextResponse.json(
        { error: "Internal Server Error", message: error },
        { status: 500 },
      );
    } else {
      console.error("Error creating applicant:", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: error },
        { status: 500 },
      );
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing ID or status" },
        { status: 400 },
      );
    }

    // 🔥 อัปเดต applicant ใน Prisma
    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedApplicant, { status: 200 });
  } catch (error) {
    console.error("Error updating applicant:", error);
    return NextResponse.json(
      { error: "Error updating applicant" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const applicants = await prisma.applicant.findMany({
      include: {
        documents: true, // ดึงข้อมูลเอกสารที่เกี่ยวข้องมาด้วย
      },
      orderBy: { id: "asc" }, // เรียงลำดับตาม order
    });

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Error fetching applicants" },
      { status: 500 },
    );
  }
}
