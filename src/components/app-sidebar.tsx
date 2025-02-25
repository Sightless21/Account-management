// app-sidebar.tsx
"use client";

import Image from "next/image";
import React from "react";
import { Briefcase, UserSearch, CircleDollarSign, ServerCog } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { User } from "@/types/users";

// ✨ กำหนดโครงสร้างเมนูแบบแยกออกมา
const NAV_ITEMS = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Briefcase,
    isActive: true,
    roles: ["EMPLOYEE", "HR", "MANAGER", "ADMIN"],
    items: [
      { title: "Home", url: "" },
      { title: "Applicant", url: "/Applicant" },
      { title: "Project board", url: "/ProjectBoard" },
      { title: "Meeting room", url: "/MeetingRoom" },
      { title: "Day off tracking", url: "/DayOff" },
      { title: "Car Reservation", url: "/CarReservation" },
      { title: "Expenses Claim", url: "/Expenses" },
    ],
  },
  {
    title: "Customer service",
    url: "/dashboard",
    icon: UserSearch,
    isActive: true,
    roles: ["EMPLOYEE", "HR", "MANAGER", "ADMIN"], 
    items: [{ title: "Customer list", url: "/CustomerList" }],
  },
  {
    title: "Financial System",
    url: "*",
    icon: CircleDollarSign,
    roles: ["HR", "MANAGER", "ADMIN"],
    items: [
      { title: "Introduction", url: "#" },
      { title: "Get Started", url: "#" },
    ],
  },
  {
    title: "Service",
    url: "/dashboard",
    icon: ServerCog,
    roles: ["HR", "MANAGER", "ADMIN"],
    items: [{ title: "Create User", url: "/CreateUser" }],
  },
];

// ✨ ทำให้ฟังก์ชันกรองเมนูใช้งานซ้ำได้
const getFilteredNavItems = (role: string | undefined) => {
  return NAV_ITEMS.filter((item) => item.roles.includes(role || "EMPLOYEE"));
};

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  const data = {
    user: {
      name: user ? `${user.firstName} ${user.lastName}` : "Guest",
      email: user?.email,
      avatar: "",
    },
    navMain: getFilteredNavItems(user?.role),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center">
        <Image src="/img/Logo.png" alt="Loading" width={100} height={50} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}