import {prisma} from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET( req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const allCustomer = await prisma.customer.findUnique({
      where: { id: id },
    });
    return NextResponse.json(allCustomer ?? [], { status: 200 }); // ✅ ถ้า null ให้คืน []
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Error fetching customer" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await req.json();
    console.log("📌 Received Body: ", data)
    const updatedCustomer = await prisma.customer.update({
      where: { id: id },
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
    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Error updating customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedCustomer = await prisma.customer.delete({ where: { id } });
    return NextResponse.json(deletedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 },
    );
  }
}