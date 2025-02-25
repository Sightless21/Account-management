'use clinet';
import React from "react";
import SettingsProfile from "@/components/SettingsProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function Page() {
  return (
    <div className="mr-3 flex flex-col gap-4 p-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Manage your personal information. This information will be displayed publicly so be careful what you share.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsProfile />
        </CardContent>
      </Card>
    </div>
  );
}