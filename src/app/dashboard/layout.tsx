"use client";
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserData } from "@/hooks/useUserData";
import { DigitalClock } from "@/components/digital-clock";
import { Skeleton } from "@/components/ui/skeleton";

//DONE : create auth
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const { data: user, isLoading, error } = useUserData();
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
  }, [status, user, router]);

  if (error) {
    toast.error("Session expired or you are not logged in. please tryagain", {
      position: "top-center",
    });
  }

  if (isLoading) {
    return (
      <section>
        <SidebarProvider defaultOpen={true} open={true}>
          <AppSidebar collapsible="icon" variant="inset" />
          <SidebarInset>
            <div className="mt-4 flex items-center gap-2 px-4 justify-between">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                <Skeleton className="h-4 w-[250px]" />
              </h3>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </section>
    );
  }

  return (
    <section>
      <SidebarProvider defaultOpen={true} open={true}>
        <AppSidebar collapsible="icon" variant="inset" user={user} />
        <SidebarInset>
          <div className="mt-4 flex items-center gap-2 px-4 justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Hello : {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
            </h3>
            <DigitalClock />
          </div>
          <div className="mt-2 h-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}