import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types/users";

// Function to fetch user data
const fetchUser = async (userID: string): Promise<User> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${userID}`);
  console.log("User Data:", response.data);
  return response.data;
};

// Custom hook to fetch and manage user data
export const useUserData = (userID: string) => {
  return useQuery({
    queryKey: ["user", userID], // ใช้ userID เพื่อระบุข้อมูลเฉพาะของแต่ละคน
    queryFn: () => fetchUser(userID), 
    enabled: !!userID, 
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 นาที
    gcTime: 30 * 60 * 1000, // 30 นาที
  });
};