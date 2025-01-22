import { create } from "zustand";
import axios from "axios";
import { formSchema } from "@/schema/formSchema";
import { z } from "zod";

type ApplicantType = z.infer<typeof formSchema>; // ใช้ infer schema แทน CardType

export type CardType = z.infer<typeof formSchema> & {
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
}

export const useApplicantStore = create<ApplicantStore>((set) => ({
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

    // ฟังก์ชันเพิ่ม applicant และดึงข้อมูลใหม่
    addApplicant: async (newApplicant: ApplicantType) => {
        try {
            await axios.post("/api/applicant", newApplicant, {
                headers: { "Content-Type": "application/json" },
            });
            await useApplicantStore.getState().fetchApplicants(); // ดึงข้อมูลใหม่
        } catch (error) {
            console.error("Error adding applicant:", error);
        }
    },
    updateApplicantStatus: (id, status) => {
        set((state) => ({
            applicants: state.applicants.map((applicant) =>
                applicant.id === id ? { ...applicant, status } : applicant
            ),
        }));
    },
}));