import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types/users";
import { useUserStore } from "@/store/useUserStore";

// Function to fetch user data
const fetchUser = async (userID: string): Promise<User> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${userID}`);
  return response.data;
};

// Custom hook to fetch and manage user data
export const useUserData = () => {
  const userID = useUserStore((state) => state.userID); // ✅ ดึง userID จาก Zustand

  return useQuery({
    queryKey: ["user", userID], 
    queryFn: () => (userID ? fetchUser(userID) : Promise.reject("No user ID")), // ป้องกัน fetch ถ้าไม่มี userID
    enabled: !!userID, // ✅ React Query จะไม่ fetch ถ้าไม่มี userID
    retry: 2,
    staleTime: 5 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,  
  });
};