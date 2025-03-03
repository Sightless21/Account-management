// src/components/Settings/SettingsPage.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { H1, Muted } from "@/components/ui/typography";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import SettingsAvatar from "@/components/Settings/SettingsAvatar";
import SettingsInfo from "@/components/Settings/SettingsInfo";
import SettingsPassword from "@/components/Settings/SettingsPassword";
import SettingsProfile from "@/components/Settings/SettingsProfile";
import SettingsTheme from "@/components/Settings/SettingsTheme";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsForm, settingsSchema, defaultValuesSettings } from "@/schema/formSettings";
import { useProfile } from "@/hooks/useProfile";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function SettingsPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);

  const { profileQuery, updateProfileMutation, userId } = useProfile();
  const { data: profile, isLoading, error } = profileQuery;

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: profile || defaultValuesSettings,
  });

  // Mutation สำหรับอัปเดตรหัสผ่าน
  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      if (!userId) throw new Error("User ID is not available");
      const { data } = await axios.patch(`/api/auth/user/password/${userId}`, passwordData);
      return data;
    },
    onSuccess: () => {
      form.resetField("user.currentPassword");
      form.resetField("user.newPassword");
      form.resetField("user.confirmPassword");
      setIsDirty(false);
    },
    onError: (error) => {
      toast.error(`Failed to update password: ${error instanceof Error ? error.message : "Unknown error"}`, {
        position: "top-center",
      });
    },
  });

  const onSubmit = useCallback(
    async (data: SettingsForm) => {
      const hasPasswordChanges =
        data.user.currentPassword && data.user.newPassword && data.user.confirmPassword;

      const hasOtherChanges =
        data.avatar !== profile?.avatar ||
        data.avatarPublicId !== profile?.avatarPublicId ||
        JSON.stringify(data.profile) !== JSON.stringify(profile?.profile) ||
        JSON.stringify(data.info) !== JSON.stringify(profile?.info) ||
        data.user.firstName !== profile?.user.firstName ||
        data.user.lastName !== profile?.user.lastName ||
        data.user.email !== profile?.user.email ||
        data.birthdate?.toISOString() !== profile?.birthdate?.toISOString() ||
        data.military !== profile?.military ||
        data.marital !== profile?.marital ||
        data.dwelling !== profile?.dwelling ||
        JSON.stringify(data.documents) !== JSON.stringify(profile?.documents);

      if (hasPasswordChanges && hasOtherChanges) {
        toast.error("Please update either your password or profile information one at a time.", {
          position: "top-center",
          duration: 3000,
        });
        return;
      }

      if (hasPasswordChanges) {
        // อัปเดตรหัสผ่าน
        await toast.promise(
          updatePasswordMutation.mutateAsync({
            currentPassword: data.user.currentPassword || "",
            newPassword: data.user.newPassword || "",
            confirmPassword: data.user.confirmPassword || "",
          }),
          {
            position: "top-center",
            loading: "Updating password...",
            success: "Password updated successfully!",
            error: (err) => `Failed to update password: ${err.message}`,
          }
        );
      } else if (hasOtherChanges) {
        // อัปเดตข้อมูลโปรไฟล์
        await toast.promise(updateProfileMutation.mutateAsync(data), {
          position: "top-center",
          loading: "Updating profile...",
          success: "Profile updated successfully!",
          error: "Failed to update profile!",
        });
      }
    },
    [updateProfileMutation, updatePasswordMutation, profile]
  );

  useEffect(() => {
    if (profile && !isDirty) {
      form.reset(profile);
    }
  }, [profile, form, isDirty]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
                form.reset(profile);
                setIsDirty(false);
                toast.dismiss(id);
                toast.success("Changes discarded", { position: "top-center", duration: 500 });
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="h-8"
              onClick={async () => {
                await form.handleSubmit(onSubmit)();
                if (Object.keys(form.formState.errors).length === 0) {
                  toast.dismiss(id);
                }
              }}
            >
              Save
            </Button>
          </div>
        ),
      });
      setToastId(id);
    } else if (!isDirty && toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  }, [isDirty, toastId, form, onSubmit, profile]);

  if (error) {
    return (
      <div className="p-4">
        <H1 className="mb-2">Settings</H1>
        <Muted>Error loading profile: {error instanceof Error ? error.message : "Unknown error"}</Muted>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <H1 className="mb-2">Settings</H1>
        <Muted>Loading...</Muted>
      </div>
    );
  }

  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <H1 className="mb-2">Settings</H1>
      <Muted>Manage your account settings and information</Muted>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6">
              <SettingsAvatar form={form} />
              <Separator />
              <SettingsProfile form={form} defaultValues={form.getValues()} />
              <Separator />
              <SettingsPassword form={form} />
              <Separator />
              <SettingsInfo form={form} defaultValues={form.getValues()} />
              <Separator />
              <SettingsTheme />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(profile);
                setIsDirty(false);
                toast.success("Changes discarded", { position: "top-center" });
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading || updateProfileMutation.isPending || updatePasswordMutation.isPending || !isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}