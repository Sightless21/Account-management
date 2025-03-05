// app-sidebar.tsx
"use client";

import Image from "next/image";
import React from "react";
import { Briefcase, Users, Github, Send, Settings, Building2 } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { User } from "@/types/users";

const NAV_ITEMS = [
  {
    title: "Workspace",
    url: "/Dashboard",
    icon: Briefcase,
    isActive: true,
    roles: ["EMPLOYEE", "HR", "MANAGER", "ADMIN"],
    items: [
      { title: "Home", url: "" },
      { title: "Applicant", url: "/Applicant" },
      { title: "Project Board", url: "/ProjectBoard" },
      { title: "Meeting Room", url: "/MeetingRoom" },
      { title: "Day Off Tracking", url: "/DayOff" },
      { title: "Car Reservation", url: "/CarReservation" },
      { title: "Expenses Claim", url: "/Expenses" },
    ],
  },
  {
    title: "Organization",
    url: "/Dashboard",
    icon: Building2,
    isActive: true,
    roles: ["EMPLOYEE", "HR", "MANAGER", "ADMIN"],
    items: [
      { title: "Customer List", url: "/CustomerList" }
    ],
  },
  {
    title: "Management",
    url: "/Dashboard",
    icon: Users,
    roles: ["HR", "MANAGER", "ADMIN"],
    items: [
      { title: "Create User", url: "/CreateUser" },
      { title: "Employee List", url: "/EmployeeList" }
    ],
  },
];

const NAV_SERVICE_ITEMS = [
  { title: "GitHub Repository", url: "https://github.com/Sightless21/Account-management", icon: Github , target: "_blank"},
  { title: "Feedback", url: "https://forms.office.com/r/NkgY9BFqKa", icon: Send , target: "_blank"},
  { title: "Settings", url: "/Dashboard/Settings", icon: Settings , target: "_self"}
]

const getFilteredNavItems = (role: string | undefined) => {
  return NAV_ITEMS.filter((item) => item.roles.includes(role || "EMPLOYEE"));
};

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  const data = {
    user: {
      name: user ? `${user.firstName} ${user.lastName}` : "Guest",
      email: user?.email,
      role: user?.role,
      avatar: user?.profileImage,
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
        <NavSecondary items={NAV_SERVICE_ITEMS} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}