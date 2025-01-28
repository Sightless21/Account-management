import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const body = await request.json();
    console.log("📌 Received ID:", id)
    console.log("📌 Received Body:", body)

    try {
        const updateKanban = await prisma.kanbanTask.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(updateKanban, { status: 200 });
    } catch (error) {
        console.error("Error updating kanban:", error);
        return NextResponse.json({ error: "Error updating kanban" }, { status: 500 });
    }
}