import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//CRUD Project

// ดึงข้อมูล Project //Get all projects and Task in Project
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                task: true,
            }
        });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
    }
}
// สร้าง Project //Add new project with empty task
export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("📌 Received Body:", data);
        if (!request.body) {
            console.error("❌ No payload received.");
            return NextResponse.json({ error: "No payload received" }, { status: 400 });
        }
        const createProject = await prisma.project.create({
            data: {
                projectName: data.projectName,
            },
        });
        return NextResponse.json(createProject, { status: 200 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Error creating project" }, { status: 500 });
    }
}
// อัปเดต Project //Update project (name)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const body = await request.json();
    console.log("📌 Received ID:", id)
    console.log("📌 Received Body:", body)

    try {
        const updateProject = await prisma.project.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(updateProject, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Error updating project" }, { status: 500 });
    }
}

// ลบ Project และ Task ที่อยู่ด้านใน
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const deleteProject = await prisma.project.delete({
            where: { id },
            include: { task: true },
        });
        return NextResponse.json(deleteProject, { status: 200 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
    }
}