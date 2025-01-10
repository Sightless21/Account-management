import { AppSidebar } from "@/components/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <SidebarProvider defaultOpen={true} open={true}>
                <AppSidebar collapsible="icon" variant="inset" />
                <SidebarInset>
                    <div className="flex items-center gap-2 px-4 mt-4">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Hello :
                        </h3><p className="text-xl text-muted-foreground">
                            {"John Doe"}
                        </p>
                    </div>
                    <div className="mt-2">
                        {children}
                        <Toaster />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </section>
    )
}