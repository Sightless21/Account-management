import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        task: true,
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 },
    );
  }
}
// สร้าง Project //Add new project with empty task
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("📌 Received Body:", data);
    if (!request.body) {
      console.error("❌ No payload received.");
      return NextResponse.json(
        { error: "No payload received" },
        { status: 400 },
      );
    }
    const createProject = await prisma.project.create({
      data: {
        projectName: data.projectName,
        description: data.description || "",
      },
    });
    return NextResponse.json(createProject, { status: 200 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 },
    );
  }
}
// อัปเดต Project //Update project (name)
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, projectName , description} = body; // รับ id และ projectName จาก body

  // ตรวจสอบว่า `id` และ `projectName` มีค่าหรือไม่
  if (!id || !projectName) {
    return NextResponse.json(
      { error: "Invalid request. 'id' and 'projectName' are required." },
      { status: 400 },
    );
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { projectName,
        description : description || ""
       }, // อัปเดตเฉพาะ projectName
    });
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Error updating project" },
      { status: 500 },
    );
  }
}

// ลบ Project และ Task ที่อยู่ด้านใน
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // ดึงค่า id จาก query string

  if (!id) {
    return NextResponse.json(
      { error: "Invalid request. 'id' is required." },
      { status: 400 },
    );
  }

  try {
    const deleteProject = await prisma.project.delete({
      where: { id },
      include: { task: true }, // ลบ tasks ที่เกี่ยวข้องด้วย
    });
    return NextResponse.json(deleteProject, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Error deleting project" },
      { status: 500 },
    );
  }
}
