// SettingsPassword.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { H3, Muted } from "@/components/ui/typography";
import { InputAddon } from "@/components/ui/input-addon";
import { UseFormReturn } from "react-hook-form";
import { SettingsForm } from "@/schema/formSettings";

interface SettingsPasswordProps {
  form: UseFormReturn<SettingsForm>;
}

export default function SettingsPassword({ form }: SettingsPasswordProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent className="grid grid-cols-2">
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <H3 className="text-xl">Password & Security</H3>
            <Muted>
              Change your password (optional). If you update your password, you&apos;ll be logged
              out after saving.
            </Muted>
          </div>
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <div>
              <InputAddon
                autoComplete="off"
                placeholder="Current Password"
                type="password"
                {...register("user.currentPassword")}
              />
              {errors.user?.currentPassword && (
                <Muted className="text-red-500">{errors.user?.currentPassword.message}</Muted>
              )}
            </div>
            <div>
              <InputAddon
                placeholder="New Password"
                type="password"
                {...register("user.newPassword")}
              />
              {errors.user?.newPassword && (
                <Muted className="text-red-500">{errors.user.newPassword.message}</Muted>
              )}
            </div>
            <div>
              <InputAddon
                placeholder="Confirm Password"
                type="password"
                {...register("user.confirmPassword")}
              />
              {errors.user?.confirmPassword && (
                <Muted className="text-red-500">{errors.user?.confirmPassword.message}</Muted>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}