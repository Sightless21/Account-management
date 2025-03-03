/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/transformProfileData.ts
import { SettingsForm, defaultValuesSettings } from "@/schema/formSettings";
import { Document } from "@/types/applicant";

export const transformProfileData = (profile: any): SettingsForm => {
  return {
    avatar: profile.user.profileImage || "",
    avatarPublicId: profile.user.profilePublicImageId || "",
    profile: {
      person: {
        fullName: profile.employee?.person?.name || "",
        phone: profile.employee?.person?.phone || profile.user.phone || "",
        email: profile.employee?.person?.email || profile.user.email || "",
        position: profile.employee?.person?.position || "",
        salary: profile.employee?.person?.expectSalary || "",
      },
    },
    user: {
      firstName: profile.user.firstName || "",
      lastName: profile.user.lastName || "",
      email: profile.user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    info: profile.employee?.info || defaultValuesSettings.info,
    birthdate: profile.employee?.birthdate ? new Date(profile.employee.birthdate) : defaultValuesSettings.birthdate,
    military: profile.employee?.military || defaultValuesSettings.military,
    marital: profile.employee?.marital || defaultValuesSettings.marital,
    dwelling: profile.employee?.dwelling || defaultValuesSettings.dwelling,
    documents: profile.documents?.map((doc: Document) => doc.name) || [],
  };
};