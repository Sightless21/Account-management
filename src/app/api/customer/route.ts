import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//TODO : endpoont customer
export async function GET() {
  try {
    const allCustomer = await prisma.customer.findMany();
    return NextResponse.json(allCustomer ?? [], { status: 200 }); // ✅ ถ้า null ให้คืน []
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Error fetching customer" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("📌 Received Body:", data)
    const newCustomer = await prisma.customer.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        position: data.position,
        address: data.address,
        phoneNumber: data.phoneNumber.toString().trim(),
        taxId: data.taxId,
        email: data.email,
        website: data.website,
        industry: data.industry,
        notes: data.notes,
      },
    });
    console.log("✅ Created Customer:", newCustomer);
    return NextResponse.json(newCustomer, { status: 200 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 },
    );
  }
}
