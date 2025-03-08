import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        documents: true,
      },
    });
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Error fetching employees" },
      { status: 500 }
    );
  }
}

// export async function PATCH(req: NextRequest) {
//   const body = await req.json();
//   console.log("📌 Received Body:", body);
//   try {
//     const updatedEmployee = await prisma.employee.update({
//       where: { id: body.id },
//       data: {
//         person: {
//           name: body.name,
//           phone: body.phoneNumber,
//           email: body.email,
//           position: body.position,
//           expectSalary: body.address,
//         },
//         birthdate: new Date(body.birthdate),
//         info: {
//           address: {
//             houseNumber: body.houseNumber,
//             village: body.village,
//             road: body.road,
//             subDistrict: body.subDistrict,
//             district: body.district,
//             province: body.province,
//             zipCode: body.zipCode,
//             country: body.country,
//           },
//           nationality: body.nationality,
//           religion: body.religion,
//           race: body.race
//         },
//         military: body.military,
//         marital: body.marital,
//         dwelling: body.dwelling,
//         documents: {
//           connect: body.documents.map((docName: string) => ({ name: docName }))
//         },
//         updatedAt: new Date()
//       },
//     });
      
//     console.log("✅ Updated Employee:", updatedEmployee);
//     return NextResponse.json(updatedEmployee, { status: 200 });
//   } catch (error) {
//     console.error("❌ Error updating employee:", error);
//     return NextResponse.json({ error: "Error updating employee" }, { status: 500 });
//   }
// }