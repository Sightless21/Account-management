"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { SettingsHeader } from "./settings-header"

const displayFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  denseMode: z.boolean(),
  showAvatars: z.boolean(),
  showStatus: z.boolean(),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

export function DisplaySettings() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      theme: "light",
      denseMode: false,
      showAvatars: true,
      showStatus: true,
    },
  })

  function onSubmit(data: DisplayFormValues) {
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <SettingsHeader title="Display & Appearance" description="Customize how the application looks and feels." />
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>Manage your theme and display preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                onValueChange={(value: "light" | "dark" | "system") => form.setValue("theme", value)}
                defaultValue={form.getValues("theme")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dense-mode">Dense Mode</Label>
                  <Switch
                    id="dense-mode"
                    checked={form.watch("denseMode")}
                    onCheckedChange={(checked) => form.setValue("denseMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-avatars">Show Avatars</Label>
                  <Switch
                    id="show-avatars"
                    checked={form.watch("showAvatars")}
                    onCheckedChange={(checked) => form.setValue("showAvatars", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-status">Show Online Status</Label>
                  <Switch
                    id="show-status"
                    checked={form.watch("showStatus")}
                    onCheckedChange={(checked) => form.setValue("showStatus", checked)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Preferences</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

