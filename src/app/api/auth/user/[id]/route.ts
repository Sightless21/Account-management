import { NextRequest , NextResponse} from "next/server"
import { prisma } from "@/lib/prisma";

//DONE : User Infomation enpoint
// ✅ GET: Fetch User Infomation
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
  try{
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerify: true
      }
    });
    return NextResponse.json(user, { status: 200 });
  }
  catch(error){
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ error: "An error occurred while fetching the user" }, { status: 500 });
  }
}