"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsProfile() {
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Manage your personal information. This information will be displayed publicly so be careful what you share.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
    </div>
  )
}

