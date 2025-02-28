import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormApplicant, ApplicantStatusType } from "@/types/applicant";


//API Function
const fetchApplicants = async (): Promise<FormApplicant[]> => {
  const { data } = await axios.get<FormApplicant[]>("/api/applicant");
  return data;
};
const addApplicant = async (newApplicant: FormApplicant) => {
  try {
    const res = await axios.post("/api/applicant", newApplicant);
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
const updateApplicant = async (updateApplicant: FormApplicant) => {
  const { id, ...data } = updateApplicant;
  try {
    const res = await axios.patch(`/api/applicant/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }

};
const updateApplicantStatus = async ({ id, status }: { id: string; status: ApplicantStatusType }) => {
  try {
    const res = await axios.patch("/api/applicant", { id, status }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
const deleteApplicant = async (id: string) => {
  try {
    const res = await axios.delete(`/api/applicant/${id}`)
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error)
    throw error;
  }

};

//React query custom Hook
export const useApplicantData = () => {
  return useQuery({
    queryKey: ["applicants"],
    queryFn: fetchApplicants,
    refetchInterval: 5 * 60 * 1000,
  })
}

const invalidateApplicants = (queryClient: QueryClient) => (
  queryClient.invalidateQueries({ queryKey: ["applicants"] })
)

export const useCreateApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addApplicant,
    onSuccess: () => invalidateApplicants(queryClient),
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
    onMutate: async (updateApplicant: { id: string; status: ApplicantStatusType }) => {
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
    onSuccess: () => invalidateApplicants(queryClient),
    // ถ้าล้มเหลว: rollback กลับไปใช้ข้อมูลเก่า
    onError: (error, updateApplicant, context) => {
      console.error("Error updating applicant status:", error);
      queryClient.setQueryData(["applicants"], context?.previousApplicants);
    },
    // เมื่อ mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือล้มเหลว): invalidate เพื่อให้แน่ใจว่าได้ข้อมูลล่าสุด
    onSettled: () => invalidateApplicants(queryClient),
  });
};

export const useDeleteApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplicant,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      const previousApplicants = queryClient.getQueryData<FormApplicant[]>(["applicants"]) || [];
      queryClient.setQueryData(["applicants"],(oldApplicants: FormApplicant[] | undefined) => oldApplicants?.filter((applicant) => applicant.id !== id))
      return { previousApplicants };
    },
    onSuccess: () => invalidateApplicants(queryClient),
    onError: (error) => {
      console.error("Error deleting applicant:", error);
    }
  })
}