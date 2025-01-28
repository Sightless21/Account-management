import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const kanban = await prisma.kanbanTask.findMany();
        return NextResponse.json(kanban, { status: 200 });
    } catch (error) {
        console.error("Error fetching kanban:", error);
        return NextResponse.json({ error: "Error fetching kanban" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("📌 Received Body:", data);
        if (!request.body) {
            console.error("❌ No payload received.");
            return NextResponse.json({ error: "No payload received" }, { status: 400 });
        }
        
        const createKanban = await prisma.kanbanTask.create({
            data: {
                projectName: data.projectName,
                taskName: data.taskName,
                description: data.description,
                status: data.status,
                priority: data.priority,
            },
        });
        return NextResponse.json(createKanban, { status: 200 });
    } catch (error) {
        console.error("Error creating kanban:", error);
        return NextResponse.json({ error: "Error creating kanban" }, { status: 500 });
    }
}