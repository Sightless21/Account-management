import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 📌 นำเข้า Prisma Client

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const createApplicant = await prisma.applicant.create({
            data : {
                person : {
                    name : data.person.name,
                    phone : data.person.phone,
                    email : data.person.email,
                    position : data.person.position,
                    expectSalary : data.person.expectSalary
                },
                birthdate : new Date(data.birthdate),
                info : {
                    address : {
                        houseNumber : data.info.address.houseNumber,
                        village : data.info.address.village,
                        road : data.info.address.road,
                        subDistrict : data.info.address.subDistrict,
                        district : data.info.address.district,
                        province : data.info.address.province,
                        zipCode : data.info.address.zipCode,
                        country : data.info.address.country
                    },
                    nationality : data.info.nationality,
                    religion : data.info.religion,
                    race : data.info.race
                    
                },
                status : data.status,
                documents : data.documents
            }
        });

        return NextResponse.json(createApplicant, { status: 201 });
    } catch (error) {
        console.log("Error creating applicant:", error);
        return NextResponse.json({ error: "Error creating applicant" }, { status: 500 });
    }
}