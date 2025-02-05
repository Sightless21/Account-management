import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
//CRUD Task in Project

// ดึง Project และ Task ทั้งหมด
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params; // ไม่ต้องใช้ await

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    return NextResponse.json(
      { error: "Error fetching project" },
      { status: 500 },
    );
  }
}

// สร้าง Task (ProjectID)
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const data = await request.json();

    console.log("Backend Data",data);

    if (!data.taskName || !data.status || !data.priority || !data.description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // ตรวจสอบว่า Project มีอยู่หรือไม่
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // สร้าง Task ใหม่ที่เชื่อมโยงกับ Project
    const createTask = await prisma.task.create({
      data: {
        taskName: data.taskName,
        status: data.status,
        priority: data.priority,
        description: data.description,
        projectId: id, //ForeignKey
      },
    });

    return NextResponse.json(createTask, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the task" },
      { status: 500 },
    );
  }
}

// อัปเดต Task (TaskID)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const data = await request.json();

    console.log(data);

    if (!data.taskName || !data.status || !data.priority || !data.description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // ตรวจสอบว่า Task มีอยู่หรือไม่
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // อัปเดต Task
    const updateTask = await prisma.task.update({
      where: { id },
      data: {
        taskName: data.taskName,
        status: data.status,
        priority: data.priority,
        description: data.description,
      },
    });

    return NextResponse.json(updateTask, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the task" },
      { status: 500 },
    );
  }
}

// ลบ Task (TaskID)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    // ลบ Task
    const deleteTask = await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(deleteTask, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the task" },
      { status: 500 },
    );
  }
}
