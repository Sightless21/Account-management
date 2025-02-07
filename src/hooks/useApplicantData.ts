import { create } from "zustand";
import axios from "axios";
import { formApplicantSchema } from "@/schema/formApplicant";
import { z } from "zod";

type ApplicantType = z.infer<typeof formApplicantSchema>; // ใช้ infer schema แทน CardType

//DONE : Applicant Zustand
export type CardType = z.infer<typeof formApplicantSchema> & {
  id: string;
  order: number;
  createdAt: string; // ✅ เปลี่ยนจาก Date เป็น string
  updatedAt: string; // ✅ เปลี่ยนจาก Date เป็น string
};

interface ApplicantStore {
  applicants: ApplicantType[];
  fetchApplicants: () => Promise<void>;
  addApplicant: (newApplicant: ApplicantType) => Promise<void>;
  updateApplicantStatus: (id: string, status: string) => void; // 📌 เพิ่มฟังก์ชันนี้
  updateApplicant: (updateApplicant: ApplicantType) => Promise<void>;
  deleteApplicant: (id: string) => Promise<void>;
}

export const useApplicantData = create<ApplicantStore>((set) => ({
  applicants: [],

  // ฟังก์ชันดึงข้อมูล applicant จาก API
  fetchApplicants: async () => {
    try {
      const { data } = await axios.get<ApplicantType[]>("/api/applicant");
      set({ applicants: data });
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  },
  addApplicant: async (newApplicant: ApplicantType) => {
    try {
      await axios.post("/api/applicant", newApplicant, {
        headers: { "Content-Type": "application/json" },
      });
      await useApplicantData.getState().fetchApplicants(); // ดึงข้อมูลใหม่
    } catch (error) {
      console.error("Error adding applicant:", error);
    }
  },
  updateApplicant: async (updateApplicant: ApplicantType) => {
    try {
      const { id, ...data } = updateApplicant;
  
      // ✅ ยิง API เพื่ออัปเดตฐานข้อมูลก่อน
      await axios.patch(`/api/applicant/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔹 Update URL:", `/api/applicant/${id}`);
  
      // ✅ อัปเดต Zustand state หลังจาก API สำเร็จ
      set((state) => ({
        applicants: state.applicants.map((applicant) =>
          applicant.id === id ? { ...applicant, ...data } : applicant,
        ),
      }));
  
      // ✅ รอ fetchApplicants() ให้เสร็จก่อน เพื่อให้ state เป็นค่าล่าสุด
      await useApplicantData.getState().fetchApplicants();
    } catch (error) {
      console.error("❌ Error updating applicant:", error);
    }
  },
  updateApplicantStatus: async (id, status) => {
    set((state) => ({
      applicants: state.applicants.map((applicant) =>
        applicant.id === id ? { ...applicant, status } : applicant,
      ),
    }));
  },
  deleteApplicant: async (id: string) => {
    try {
      await axios.delete(`/api/applicant/${id}`);
      console.log(`Successfully deleted applicant with ID: ${id}`);
      await useApplicantData.getState().fetchApplicants(); // ดึงข้อมูลใหม่
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  },
}));
