"use client"

import * as React from "react"
import { KeyRound, Palette, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DisplaySettings } from "@/components/Settings/display-settings"
import { ProfileSettings } from "@/components/Settings/profile-settings"
import { SecuritySettings } from "@/components/Settings/security-settings"
import type { SettingsPage } from "@/types/settings"

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = React.useState<SettingsPage>("profile")

  const tabs = [
    {
      id: "profile" as const,
      label: "Profile Settings",
      icon: User,
    },
    {
      id: "display" as const,
      label: "Display & Appearance",
      icon: Palette,
    },
    {
      id: "security" as const,
      label: "Security & Password",
      icon: KeyRound,
    },
  ]

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="hidden w-[240px] flex-col border-r px-4 py-6 sm:flex">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your preferences</p>
        </div>
        <Separator className="mb-4" />
        <nav className="grid gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={currentPage === tab.id ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setCurrentPage(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {currentPage === "profile" && <ProfileSettings />}
          {currentPage === "display" && <DisplaySettings />}
          {currentPage === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  )
}

