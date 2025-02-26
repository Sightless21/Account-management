import { Card, CardContent } from "@/components/ui/card"
import { H3, Muted } from "@/components/ui/typography"
import { ThemeSwitch } from "@/components/theme-switch"

export default function SettingsTheme() {
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent className="grid grid-cols-2 gap-3 space-y-1.5 p-6 items-center">
          <div>
            <H3 className="text-xl">Theme</H3>
            <Muted> Change your theme. After saving, you&apos;ll be logged out.</Muted>
          </div>
          <ThemeSwitch />
        </CardContent>
      </Card>
    </div>
  )
}