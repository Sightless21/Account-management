"use client";

import { Card, CardContent } from "@/components/ui/card";
import { H3, Muted } from "@/components/ui/typography";
import { UseFormReturn } from "react-hook-form";
import { SettingsForm } from "@/schema/formSettings";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface SettingsAvatarProps {
  form: UseFormReturn<SettingsForm>;
}

export default function SettingsAvatar({ form }: SettingsAvatarProps) {
  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("avatar", base64String, { shouldDirty: true }); // เก็บ base64 ชั่วคราว
        form.setValue("avatarPublicId", "", { shouldDirty: true }); // ล้าง publicId เดิม
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("avatar", "", { shouldDirty: true });
      form.setValue("avatarPublicId", "", { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent className="grid grid-cols-2">
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <H3 className="text-xl">Avatar Change</H3>
            <Muted>You can change avatar to show on the website</Muted>
          </div>
          <div className="flex flex-col gap-3 space-y-1.5 p-6">
            <AvatarUpload
              value={form.getValues("avatar")}
              onChange={handleAvatarChange}
              defaultValue={form.getValues("avatar")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}