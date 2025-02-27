import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormApplicant } from "@/types/applicant";


// API Functions
const fetchApplicants = async (): Promise<FormApplicant[]> => {
  const { data } = await axios.get<FormApplicant[]>("/api/applicant");
  return data;
};

const addApplicant = async (newApplicant: FormApplicant) => {
  await axios.post("/api/applicant", newApplicant);
};

const updateApplicant = async (updateApplicant: FormApplicant) => {
  const { id, ...data } = updateApplicant;
  await axios.patch(`/api/applicant/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

const updateApplicantStatus = async ({ id, status }: { id: string; status: string }) => {
  await axios.patch("/api/applicant", { id, status }, {
    headers: { "Content-Type": "application/json" },
  });
};

const deleteApplicant = async (id: string) => {
  await axios.delete(`/api/applicant/${id}`);
};

export const useApplicantData = ()=> {
  return useQuery({
    queryKey: ["applicants"],
    queryFn: fetchApplicants,
    staleTime: 5 * 60 * 1000, 
  })
}

export const useCreateApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    onError: (error) => {
      console.error("Error adding applicant:", error);
    },
  });
}

export const useUpdateApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    onError: (error) => {
      console.error("Error updating applicant:", error)
    }
    });
}

export const useUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicantStatus, // ฟังก์ชันที่ส่ง request ไปยัง server
    // Optimistic Update: อัปเดต UI ก่อนส่ง request
    onMutate: async (updateApplicant: { id: string; status: string }) => {
      // ยกเลิก query ที่กำลังทำงานเพื่อป้องกัน race condition
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      // ดึงข้อมูลเก่าก่อนอัปเดต เพื่อใช้ rollback ถ้าล้มเหลว
      const previousApplicants = queryClient.getQueryData<FormApplicant[]>(["applicants"]) || [];
      // อัปเดตข้อมูลใน cache ทันที (optimistic update)
      queryClient.setQueryData<FormApplicant[]>(["applicants"], (oldApplicants) => {
        if (!oldApplicants) return [];
        return oldApplicants.map((applicant) =>
          applicant.id === updateApplicant.id
            ? { ...applicant, status: updateApplicant.status }
            : applicant
        );
      });
      // ส่งข้อมูลเก่ากลับไปเพื่อใช้ใน onError
      return { previousApplicants };
    },
    // ถ้าสำเร็จ: invalidate cache เพื่อ sync กับ server
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
    // ถ้าล้มเหลว: rollback กลับไปใช้ข้อมูลเก่า
    onError: (error, updateApplicant, context) => {
      console.error("Error updating applicant status:", error);
      queryClient.setQueryData(["applicants"], context?.previousApplicants);
    },
    // เมื่อ mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือล้มเหลว): invalidate เพื่อให้แน่ใจว่าได้ข้อมูลล่าสุด
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });
};

export const useDeleteApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"]})
    }
  })
}