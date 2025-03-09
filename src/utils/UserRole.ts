import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { User } from "@/types/users";

export const useUserRole = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const userID = session?.user?.id;
  const user = userID ? queryClient.getQueryData<User>(["user", userID]) : undefined;
  const role = user?.role ?? "EMPLOYEE";

  return {
    role,
    status,
    userID,
    user,
  };
};