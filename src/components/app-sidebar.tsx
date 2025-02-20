"use client";

// react + next
import Image from "next/image";
import React from "react";

// icons
import {
  Briefcase,
  UserSearch,
  CircleDollarSign,
  ServerCog,
} from "lucide-react";

//nav components
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// sidebar components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User } from "@/types/users"

//DONE : Appsidebar
export function AppSidebar({ user , ...props }: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {

  // data for sidebar
  const data = {
    user: {
      name: user?.firstName as string + " " + user?.lastName as string,
      email: user?.email,
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
            title: "Home",
            url: "",
          },
          {
            title: "Applicant",
            url: "/Applicant",
          },
          {
            title: "Project board",
            url: "/ProjectBoard",
          },
          {
            title: "Meeting room",
            url: "/MeetingRoom",
          },
          {
            title: "Day off tracking",
            url: "/DayOff",
          },
          {
            title: "Car Reservation",
            url: "/CarReservation",
          },
          {
            title: "Expenses Claim",
            url: "/Expenses",
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
            title: "Create New User",
            url: "/newUser",
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props} >
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
