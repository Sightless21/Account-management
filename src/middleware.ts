import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;
  // console.log("🔹 Token from Cookie:", sessionToken); // ✅ Debug
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secretKey = process.env.NEXTAUTH_SECRET;
    if (!secretKey) throw new Error("NEXTAUTH_SECRET is missing");

    // 🟢 ใช้ getToken() เพื่อถอดรหัส JWT
    const decoded = await getToken({ req, secret: secretKey });
    // console.log(decoded); // ✅ Debug
    const { id } = decoded as {id: string}
    console.log("🔹 Form Middleware User ID:", id);

    if (!decoded) {
      throw new Error("Invalid token");
    }

  } catch (error) {
    console.error("❌ JWT Decode Error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Dashboard/:path*"],
};