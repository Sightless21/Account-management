/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 📌 นำเข้า Prisma Client

export async function POST(request: Request) {
    try {
        const data = await request.json();

        console.log("📌 Received Body:", data);
        if (!request.body) {
            console.error("❌ No payload received.");
            return NextResponse.json({ error: "No payload received" }, { status: 400 });
        }

        // Validate the payload
        if (!data || !data.person.name || !data.person.email || !data.birthdate) {
            console.error("❌ Invalid payload:", data);
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const createApplicant = await prisma.applicant.create({
            data: {
                person: {
                    name: data.person.name,
                    phone: data.person.phone,
                    email: data.person.email,
                    position: data.person.position,
                    expectSalary: data.person.expectSalary
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
                        country: data.info.address.country
                    },
                    nationality: data.info.nationality,
                    religion: data.info.religion,
                    race: data.info.race

                },
                itemsDwelling: data.itemsDwelling[0],
                itemsMarital: data.itemsMarital[0],
                itemsMilitary: data.itemsMilitary[0],
                status: data.status || "NEW",
                documents: data.itemsDoc.length > 0 ? { create: data.itemsDoc.map((doc : any) => ({ name: doc })) } : undefined, // ✅ ป้องกัน `undefined.map()`
            },
        });
        console.log("createApplicant:", createApplicant);
        if (!createApplicant) {
            throw new Error("createApplicant is null or undefined.");
        }
        return NextResponse.json(createApplicant, { status: 202 });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error creating applicant:", error.message);
        } else {
            console.error("Error creating applicant:", error)
            return NextResponse.json({ error: "Internal Server Error", message: error }, { status: 500 });
        }
    }
}