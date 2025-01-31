import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

async function fetchUser(userID: string) {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${userID}`, {
      headers: {
        "Cache-Control": "no-store", // ป้องกัน cache
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <p className="text-red-500">You are not logged in.</p>;
  }

  const user = await fetchUser(session.user.id);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {session.user.id}</p>
      <p>Role: {session.user.role}</p>
      <p>Verify: {user?.isVerify ? "True" : "False"}</p>

      {/* แสดงปุ่ม Verify หาก user ยังไม่ยืนยันตัวตน */}
      {!user?.isVerify && <Button>Verify</Button>}

      {/* แสดงปุ่มตาม Role */}
      {session.user.role === "ADMIN" && <Button>Admin</Button>}
      {session.user.role === "HR" && <Button>HR</Button>}
      {session.user.role === "MANAGER" && <Button>Manager</Button>}
    </div>
  );
}