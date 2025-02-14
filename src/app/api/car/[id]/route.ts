import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({ where: { id } });
    return NextResponse.json(car, { status: 200 })
  } catch (error) {
    console.error("Error get car:", error)
    return NextResponse.json(
      { error: "Error get a car" },
      { status: 500 }
    )
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedCar = await prisma.car.delete({ where: { id } });
    return NextResponse.json(deletedCar, { status: 200 });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Error deleting car" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await req.json();
    console.log("📌 Received Body: ", data);

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        name: data.name,
        plate: data.plate.trim(),
        type: data.type,
      },
    });
    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Error updating car" },
      { status: 500 },
    );
  }
}