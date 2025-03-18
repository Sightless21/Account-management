import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        task: {
          orderBy: { order: "asc" }, 
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    return NextResponse.json({ error: "Error fetching project" }, { status: 500 });
  }
}

// สร้าง Task (ProjectID)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!data.taskName || !data.status || !data.priority || !data.description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const createTask = await prisma.task.create({
      data: {
        id: data.id || undefined,
        assignee: data.assignee || undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        taskName: data.taskName,
        status: data.status,
        priority: data.priority,
        description: data.description,
        projectId: id,
        order: data.order !== undefined ? Number(data.order) : 0, // เพิ่ม order
      },
    });

    return NextResponse.json(createTask, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return NextResponse.json({ error: "An error occurred while creating the task" }, { status: 500 });
  }
}

// อัปเดต Task (TaskID)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const data = await request.json();

    if (!data.taskName || !data.status || !data.priority || !data.description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updateTask = await prisma.task.update({
      where: { id },
      data: {
        taskName: data.taskName,
        status: data.status,
        priority: data.priority,
        description: data.description,
        assignee: data.assignee || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        order: data.order !== undefined ? Number(data.order) : task.order, // เพิ่ม order
      },
    });

    return NextResponse.json(updateTask, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return NextResponse.json({ error: "An error occurred while updating the task" }, { status: 500 });
  }
}

// ลบ Task (TaskID)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  console.log("📌 ID", id);
  try {
    // ลบ Task
    const deleteTask = await prisma.task.delete({
      where: { id },
    });
    console.log(deleteTask);

    return NextResponse.json(deleteTask, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the task" },
      { status: 500 },
    );
  }
}
