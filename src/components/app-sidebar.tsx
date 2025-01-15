"use client"

// react + next
import Image from 'next/image'
import * as React from "react"

// icons
import {
  Briefcase,
  UserSearch,
  CircleDollarSign,
  ServerCog,
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

  const data = {
    user: {
      name: "John Doe",
      email: "m@example.com",
      avatar: "",
    },
    navMain: [
      {
        title: "Wokrspace",
        url: "/dashboard",
        icon: Briefcase,
        isActive: true,
        items: [
          {
            title : "Home",
            url: "",
          },
          {
            title: "Applicant",
            url: "/Applicant",
          },
          {
            title: "Kanban Board",
            url: "/KanBanBoard",
          },
          {
            title: "Meeting room",
            url: "/MeetingRoom",
          },
          {
            title : "Leave of absence",
            url: "/LeaveOfAbsence",
          },
          {
            title : "Reserve a car",
            url: "/ReserveACar",
          },
          {
            title : "Claim expenses",
            url: "/ClaimExpenses",
          },
        ],
      },
      {
        title: "Customer service",
        url: "/dashboard",
        icon: UserSearch,
        items: [
          {
            title: "Customer list",
            url: "/CustomerList",
          },
        ],
      },
      {
        title: "Financial System",
        url: "*",
        icon: CircleDollarSign,
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
        title: "Service",
        url: "/dashboard",
        icon: ServerCog,
        items: [
          {
            title: "New user",
            url: "/NewUser",
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
