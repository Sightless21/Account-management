"use client";
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/hooks/useUserStroe";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const id = session?.user?.id;
  const { user, fetchUser } = useUserStore();
  const router = useRouter();

  // ดึงข้อมูลเมื่อ id เปลี่ยนและ status เป็น authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      toast.error("Session expired or you are not logged in.", {
        position: "top-center",
      });
      return;
    }

    if (id && !user) { // ดึงข้อมูลเฉพาะเมื่อ id และ user ยังไม่ได้รับการตั้งค่า
      fetchUser(id);
    }
  }, [id, status, user, fetchUser, router]);

  return (
    <section>
      <SidebarProvider defaultOpen={true} open={true}>
        <AppSidebar collapsible="icon" variant="inset" />
        <SidebarInset>
          <div className="mt-4 flex items-center gap-2 px-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Hello : {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
            </h3>
          </div>
          <div className="mt-2">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}