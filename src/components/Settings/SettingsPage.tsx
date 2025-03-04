/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { signOut } from "next-auth/react";
import { AxiosError } from "axios";
type PasswordData = { currentPassword: string; newPassword: string; confirmPassword: string };

// ฟังก์ชันช่วยตรวจสอบการเปลี่ยนแปลง
const hasChanges = (newData: any, originalData: any, fields: string[]) =>
  fields.some((field) => newData[field] !== originalData?.[field]);

const hasProfileChanges = (data: SettingsForm, profile?: SettingsForm) => {
  if (!profile) return true;
  return (
    data.avatar !== profile.avatar ||
    data.avatarPublicId !== profile.avatarPublicId ||
    JSON.stringify(data.profile) !== JSON.stringify(profile.profile) ||
    JSON.stringify(data.info) !== JSON.stringify(profile.info) ||
    hasChanges(data.user, profile.user, ["firstName", "lastName", "email"]) ||
    data.birthdate?.toISOString() !== profile.birthdate?.toISOString() ||
    data.military !== profile.military ||
    data.marital !== profile.marital ||
    data.dwelling !== profile.dwelling ||
    JSON.stringify(data.documents) !== JSON.stringify(profile.documents)
  );
};

const requiresLogout = (data: SettingsForm, profile?: SettingsForm) => {
  if (!profile) return false;
  return hasChanges(data.user, profile.user, ["firstName", "lastName", "email"]) ||
    data.avatar !== profile.avatar ||
    data.avatarPublicId !== profile.avatarPublicId;
};

export default function SettingsPage() {
  const [isDirty, setIsDirty] = useState(false);
  const { profileQuery, updateProfileMutation, userId } = useProfile();
  const { data: profile, isLoading, error } = profileQuery;

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: profile ? { ...defaultValuesSettings, ...profile } : defaultValuesSettings,
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData: PasswordData) => {
      if (!userId) throw new Error("User ID is not available");
      const { data } = await axios.patch(`/api/auth/user/password/${userId}`, passwordData);
      return data;
    },
    onSuccess: () => {
      form.resetField("user.currentPassword");
      form.resetField("user.newPassword");
      form.resetField("user.confirmPassword");
      setIsDirty(false);
      toast.success("Password updated successfully!", { position: "top-center" });
      signOut({ callbackUrl: "/" });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to update password: ${error instanceof Error ? error.message : "Unknown error"}`, {
        position: "top-center",
      });
    },
  });

  const handleUpdateProfile = useCallback(
    async (data: SettingsForm) => {
      await updateProfileMutation.mutateAsync(data);
      toast.success("Profile updated successfully!", { position: "top-center" });
      if (requiresLogout(data, profile)) {
        signOut({ callbackUrl: "/" });
      }
    },
    [updateProfileMutation, profile]
  );

  const handleUpdatePassword = useCallback(
    async (data: SettingsForm) => {
      await updatePasswordMutation.mutateAsync({
        currentPassword: data.user.currentPassword || "",
        newPassword: data.user.newPassword || "",
        confirmPassword: data.user.confirmPassword || "",
      });
    },
    [updatePasswordMutation]
  );

  const onSubmit = useCallback(
    async (data: SettingsForm) => {
      try {
        const hasPassword = data.user.currentPassword && data.user.newPassword && data.user.confirmPassword;
        const hasProfile = hasProfileChanges(data, profile);

        if (hasPassword && hasProfile) {
          toast.error("Please update either your password or profile information one at a time.", {
            position: "top-center",
            duration: 3000,
          });
          return;
        }

        if (hasPassword) {
          await handleUpdatePassword(data);
        } else if (hasProfile) {
          await handleUpdateProfile(data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(`Error updating information: ${error.response?.data.message || error.message}`);
        } else {
          toast.error(`Error updating information: ${error}`);
        }
      }
    },
    [handleUpdateProfile, handleUpdatePassword, profile]
  );

  useEffect(() => {
    if (profile && !isDirty) {
      form.reset(profile);
    }
  }, [profile, form, isDirty]);

  useEffect(() => {
    const subscription = form.watch(() => setIsDirty(form.formState.isDirty));
    return () => subscription.unsubscribe();
  }, [form]);

  const resetForm = () => {
    form.reset(profile);
    setIsDirty(false);
    toast.success("Changes discarded", { position: "top-center" });
  };

  if (error) return <ErrorView message={error instanceof Error ? error.message : "Unknown error"} />;
  if (isLoading) return <LoadingView />;

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
            <Button type="button" variant="outline" onClick={resetForm}>
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

const LoadingView = () => (
  <div className="p-4">
    <H1 className="mb-2">Settings</H1>
    <Muted>Loading...</Muted>
  </div>
);

const ErrorView = ({ message }: { message: string }) => (
  <div className="p-4">
    <H1 className="mb-2">Settings</H1>
    <Muted>Error loading profile: {message}</Muted>
  </div>
);
