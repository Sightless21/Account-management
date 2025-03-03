// src/hooks/react-query/useProfile.ts
import axios from "axios";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { transformProfileData } from "@/utils/transformProfileData";
import { SettingsForm } from "@/schema/formSettings";

export const useProfile = (): {
  profileQuery: UseQueryResult<SettingsForm, unknown>;
  updateProfileMutation: UseMutationResult<any, unknown, SettingsForm, unknown>;
  userId: string | undefined;
} => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchProfile = async (): Promise<SettingsForm> => {
    if (!userId) throw new Error("User ID is not available");
    const { data } = await axios.get(`/api/auth/user/profile/${userId}`);
    return transformProfileData(data);
  };

  const updateProfile = async (data: SettingsForm): Promise<any> => {
    if (!userId) throw new Error("User ID is not available");
    const { data: response } = await axios.patch(`/api/auth/user/profile/${userId}`, data);
    return transformProfileData(response); // แปลงข้อมูลที่ได้กลับมา
  };

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      profileQuery.refetch();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
    userId,
  };
};