"use client"

import * as z from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { H1, Muted } from "@/components/ui/typography"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import SettingsTheme from "@/components/Settings/SettingsTheme"
import SettingsAvatar from "@/components/Settings/SettingsAvatar"
import SettingsProfile from "@/components/Settings/SettingsProfile"
import SettingsPassword from "@/components/Settings/SettingsPassword"
import SettingsInfo from "@/components/Settings/SettingsInfo"

const settingsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

type SettingsForm = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [isDirty, setIsDirty] = useState(false)
  const [toastId, setToastId] = useState<string | number | null>(null)

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = useCallback(async (data: SettingsForm) => {
    try {
      console.log("Form submitted:", data)
      toast.success("Settings saved successfully!", {
        position: "top-center"
      })
      form.reset(data)
      setIsDirty(false)
    } catch (error) {
      toast.error("Failed to save settings", {
        position: "top-center"
      })
      throw error
    }
  }, [form])

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(form.formState.isDirty)
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    if (isDirty && !toastId) {
      const id = toast("You have unsaved changes", {
        position: "bottom-center",
        duration: Infinity,
        dismissible: false,
        action: (
          <div className="flex gap-2">
            <Button
              className="dark:text-white h-8"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset()
                setIsDirty(false)
                toast.dismiss(id)
                toast.success("Changes discarded", {
                  position: "top-center",
                  duration: 500
                })
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="h-8"
              onClick={async () => {
                await form.handleSubmit(onSubmit)()
                if (Object.keys(form.formState.errors).length === 0) {
                  toast.dismiss(id)
                }
              }}
            >
              Save
            </Button>
          </div>
        ),
      })
      setToastId(id)
    } else if (!isDirty && toastId) {
      toast.dismiss(toastId)
      setToastId(null)
    }
  }, [isDirty, toastId, form, onSubmit])

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <H1 className="mb-2">Settings</H1>
      <Muted>Manage your account settings and information</Muted>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6">
              <SettingsAvatar />
              <Separator />
              <SettingsProfile form={form} />
              <Separator />
              <SettingsPassword form={form} />
              <Separator />
              <SettingsInfo/>
              <Separator />
              <SettingsTheme />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}