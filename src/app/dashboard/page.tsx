import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

//DONE : Fetch User Infomation
async function fetchUser(userID: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${userID}`, {
      cache: "no-store", // Cache 60 วินาที ถ้าอยากให้ no-cache ใช้ { cache: "no-store" }
    });


    if (!res.ok) throw new Error("Failed to fetch user");

    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const user = await fetchUser(session.user.id);

  if (!user?.isVerify) {
    return redirect("/verify");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {session.user.id}</p>
      <p>Role: {session.user.role}</p>
      <p>Verify: {user?.isVerify ? "True" : "False"}</p>

      {/* แสดงปุ่มตาม Role */}
      {session.user.role === "ADMIN" && <Button>Admin</Button>}
      {session.user.role === "HR" && <Button>HR</Button>}
      {session.user.role === "MANAGER" && <Button>Manager</Button>}
    </div>
  );
}