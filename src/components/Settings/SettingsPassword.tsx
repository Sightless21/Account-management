import { Card, CardContent } from "@/components/ui/card"
import { H3, Muted } from "@/components/ui/typography"
import { InputAddon } from "@/components/ui/input-addon"

export default function SettingsPassword() {
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent className="grid grid-cols-2">
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <H3 className="text-xl">Password & Security</H3>
            <Muted> Change your password. After saving, you&apos;ll be logged out.</Muted>
          </div>
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <InputAddon placeholder="Current Password" rightIconText="Current Password" />
            <InputAddon placeholder="Password" rightIconText="Password" />
            <InputAddon placeholder="Confirm Password" rightIconText="Confirm Password" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}