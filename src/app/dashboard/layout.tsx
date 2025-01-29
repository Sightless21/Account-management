'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Toaster } from 'sonner';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession() as { data: Session | null; status: string }
    console.log('status ' + status)

    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [router, status])

    return (
        <section>
            <SidebarProvider defaultOpen={true} open={true}>
                <AppSidebar collapsible="icon" variant="inset" />
                <SidebarInset>
                    <div className="flex items-center gap-2 px-4 mt-4">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Hello :
                        </h3><p className="text-xl text-muted-foreground">
                            {session?.user?.name?.split(" ").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ")}
                        </p>
                    </div>
                    <div className="mt-2">
                        <Toaster position="top-center" richColors offset="10vh" />
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </section>
    )
}