"use client";

// icons
import { ChevronsUpDown, LogOut, Settings , UserRoundPen , MonitorCog , Lock } from "lucide-react";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import CustomAlertDialog from "@/components/ui/customAlertDialog";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // Get the initials of the user
  const fullName = user.name as string;
  function getInitials(fullName: string) {
    const names = fullName.split(" ");
    const initials = names.map((name) => name[0].toUpperCase()).join("");
    return initials;
  }

  const initials = getInitials(fullName);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold capitalize">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {/* {initials} */}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuLabel className="flex"><Settings className="mr-5 size-5"/>Setting</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push("/Settings")}>
                <UserRoundPen className="mr-5"/> <span className="text-muted-foreground">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MonitorCog className="mr-5"/> <span className="text-muted-foreground">Display & Appearance</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="mr-5"/> <span className="text-muted-foreground">Security & Password</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer">
              <LogOut className="mr-5" /> <span className="text-muted-foreground">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CustomAlertDialog
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleLogout}
        confirmText="Logout"
        cancelText="Cancel"
        confirmIcon={LogOut}
      />
    </SidebarMenu>
  );
}
