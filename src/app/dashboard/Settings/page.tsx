'use clinet';

import React from "react";
import SettingsProfile from "@/components/Settings/SettingsProfile";
import SettingsAvatar from "@/components/Settings/SettingsAvatar";
import SettingsPassword from "@/components/Settings/SettingsPassword";
import SettingsTheme from "@/components/Settings/SettingsTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
export default function Page() {
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="mb-6 text-2xl">Settings</CardTitle>
          <Separator/>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <SettingsProfile />
          <Separator/>
          <SettingsAvatar/>
          <Separator/>
          <SettingsPassword/>
          <Separator/>
          <SettingsTheme/>
        </CardContent>
      </Card>
    </div>
  );
}