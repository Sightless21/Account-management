"use client"

// react + next
import { useSession } from "next-auth/react"
import Image from 'next/image'
import * as React from "react"

// icons
import {
  BookOpen,
  Bot,
  Briefcase,
  Frame,
  Map,
  PieChart,
  Settings2,
} from "lucide-react"

//nav components
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
// sidebar components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// mui components
import Divider from '@mui/joy/Divider';
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const data = {
    user: {
      name: session?.user?.name ?? "John Doe",
      email: session?.user?.email ?? "m@example.com",
      avatar: session?.user?.image ?? "",
    },
    navMain: [
      {
        title: "Wokrspace",
        url: "#",
        icon: Briefcase,
        isActive: true,
        items: [
          {
            title: "Applicant",
            url: "#",
          },
          {
            title: "Kanban",
            url: "#",
          },
          {
            title: "Meeting room",
            url: "#",
          },
          {
            title : "Leave of absence",
            url: "#"
          },
          {
            title : "Reserve a car",
            url: "#"
          },
          {
            title : "claim expenses",
            url: "#"
          },
        ],
      },
      {
        title: "Customer service",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Customer list",
            url: "#",
          },
        ],
      },
      {
        title: "Financial System",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
        ],
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center">

        <Image src="/img/Logo.png" alt="Loading" width={100} height={50} />
        <Divider />

      </SidebarHeader>
      <SidebarContent>

        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>

        <NavUser user={data.user} />

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
