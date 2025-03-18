/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("📌 Received Body:", data);

    if (!data) {
      console.error("❌ No payload received.");
      return NextResponse.json({ error: "No payload received" }, { status: 400 });
    }

    if (!data.documents || !Array.isArray(data.documents)) {
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
        dwelling: data.dwelling,
        marital: data.marital,
        military: data.military,
        documents: data.documents.length > 0
          ? { create: data.documents.map((doc: any) => ({ name: doc })) }
          : undefined,
        status: data.status || "NEW",
        order: data.order !== undefined ? Number(data.order) : 0, // เพิ่ม order ค่าเริ่มต้นเป็น 0
      },
    });

    console.log("createApplicant:", createApplicant);

    if (!createApplicant) {
      throw new Error("Failed to create applicant");
    }

    return NextResponse.json(createApplicant, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating applicant:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", message: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error creating applicant:", error);
      return NextResponse.json(
        { error: "Internal Server Error", message: String(error) },
        { status: 500 }
      );
    }
  }
}

// PATCH และ GET คงไว้เหมือนเดิม
export async function PATCH(request: Request) {
  try {
    const { id, status, order } = await request.json(); // เพิ่ม order

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing ID or status" },
        { status: 400 },
      );
    }

    const updatedApplicant = await prisma.applicant.update({
      where: { id },
      data: {
        status,
        order: order !== undefined ? Number(order) : undefined, // อัปเดต order ถ้ามี
      },
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
        documents: true,
      },
      orderBy: [
        { status: "asc" }, // เรียงตาม status ก่อน
        { order: "asc" }, // แล้วเรียงตาม order
      ],
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