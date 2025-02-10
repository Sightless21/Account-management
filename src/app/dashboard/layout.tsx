"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { DigitalClock } from "@/components/digital-clock";
import { toast } from "sonner";
import { useUserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const userID = session?.user?.id;
  const { data: user, isLoading } = useUserData(userID || "");
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Redirect user if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      toast.error("Session expired or you are not logged in.", {
        position: "top-center",
      });
    }
  }, [status, router]);

  // Loading state for pathname change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Loading state for UI
  if (loading || isLoading || !user) {
    return (
      <section>
        <SidebarProvider defaultOpen={true} open={true}>
          <AppSidebar collapsible="icon" variant="inset" user={user ?? null} />
          <SidebarInset>
            <div className="mt-4 flex items-center gap-2 px-4 justify-between">
              {isLoading ? (
                <Skeleton className="h-full w-full m-3" />
              ) : (
                <h3 className="text-2xl font-semibold tracking-tight">
                  Hello : {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
                </h3>
              )}
              <DigitalClock />
            </div>
            <Skeleton className="h-full w-full m-3 " />
          </SidebarInset>
        </SidebarProvider>
      </section>
    );
  }

  return (
    <section>
      <SidebarProvider defaultOpen={true} open={true}>
        <AppSidebar collapsible="icon" variant="inset" user={user ?? null} />
        <SidebarInset>
          <div className="mt-4 flex items-center gap-2 px-4 justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">
              Hello : {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
            </h3>
          </div>
          <DigitalClock />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-2 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}