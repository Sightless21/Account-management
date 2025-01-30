"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession()
  
  /* | --------- you can get user id from session  ---------|
     |                                                      |
     |                                                      |
     | console.log("User logined ID :",session?.user?.id);  |
     |                                                      |
     -------------------------------------------------------*/

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      toast.error("Please try login again. Your session has expired or you are not logged in.");
    }
  }, [router, status]);

  return (
    <section>
      <SidebarProvider defaultOpen={true} open={true}>
        <AppSidebar collapsible="icon" variant="inset"/>
        <SidebarInset>
          <div className="mt-4 flex items-center gap-2 px-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Hello :
            </h3>
            <p className="text-xl text-muted-foreground">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                .join(" ")}
            </p>
          </div>
          <div className="mt-2">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
