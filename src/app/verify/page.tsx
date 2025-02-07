import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import VerifyForm from "@/components/verify-form";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect("/");
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <VerifyForm userId={session.user.id} />
        </div>
    );
}
