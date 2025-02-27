"use client"

import { H3, Muted } from "@/components/ui/typography"
import { Card, CardContent } from "@/components/ui/card"
import { InputAddon } from "@/components/ui/input-addon"
import { User2Icon, Mail } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { SettingsForm } from "@/schema/formSettings"

interface SettingsProfileProps {
  form: UseFormReturn<SettingsForm>
  defaultValues: SettingsForm
}

export default function SettingsProfile({ form, defaultValues }: SettingsProfileProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent className="grid grid-cols-2">
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <H3 className="text-xl">Profile</H3>
            <Muted>Manage your personal information. This information will be displayed publicly so be careful what you share.</Muted>
          </div>
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <div>
              <InputAddon
                defaultValue={defaultValues.firstName}
                placeholder="Firstname"
                leftIcon={User2Icon}
                rightIconText="Firstname"
                {...register("firstName")}
              />
              {errors.firstName && (
                <Muted className="text-red-500">{errors.firstName.message}</Muted>
              )}
            </div>
            <div>
              <InputAddon
                defaultValue={defaultValues.lastName}
                placeholder="Lastname"
                leftIcon={User2Icon}
                rightIconText="Lastname"
                {...register("lastName")}
              />
              {errors.lastName && (
                <Muted className="text-red-500">{errors.lastName.message}</Muted>
              )}
            </div>
            <div>
              <InputAddon
                defaultValue={defaultValues.email}
                type="text"
                autoComplete={"one-time-code"}
                placeholder="Email"
                leftIcon={Mail}
                rightIconText="Email"
                {...register("email")}
              />
              {errors.email && (
                <Muted className="text-red-500">{errors.email.message}</Muted>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}