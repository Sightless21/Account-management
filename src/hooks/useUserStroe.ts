import { create } from "zustand";
import axios from "axios";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerify: boolean;
};

type UserStore = {
  user: User | null;
  loading: boolean; // เพิ่มสถานะการโหลด
  fetchUser: (userID: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false, // ค่าเริ่มต้นของสถานะการโหลด
  fetchUser: async (userID: string) => {
    set({ loading: true }); // ตั้งสถานะเป็นกำลังโหลด
    try {
      const response = await axios.get(`/api/auth/user/${userID}`);
      console.log("Fetched user:", response.data);
      set({ user: response.data, loading: false }); // เก็บข้อมูล user และปิดสถานะการโหลด
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ loading: false }); // ปิดสถานะการโหลดหากเกิดข้อผิดพลาด
    }
  },
}));