import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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
        order: data.order !== undefined ? Number(data.order) : task.order,
      },
    });

    return NextResponse.json(updateTask, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return NextResponse.json({ error: "An error occurred while updating the task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const deletedTask = await prisma.task.delete({ where: { id } });
    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Error deleting task" },
      { status: 500 },
    );
  }
}