import { create } from "zustand";
import axios from "axios";
import { formSchema } from "@/schema/formSchema";
import { z } from "zod";

type ApplicantType = z.infer<typeof formSchema>; // ใช้ infer schema แทน CardType

interface ApplicantStore {
    applicants: ApplicantType[];
    fetchApplicants: () => Promise<void>;
    addApplicant: (newApplicant: ApplicantType) => Promise<void>;
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
}));