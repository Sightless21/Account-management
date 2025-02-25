import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formApplicantSchema } from "@/schema/formApplicant";
import { z } from "zod";

export type ApplicantType = z.infer<typeof formApplicantSchema>;

export type CardType = z.infer<typeof formApplicantSchema> & {
  id: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// API Functions
const fetchApplicants = async (): Promise<CardType[]> => {
  const { data } = await axios.get<CardType[]>("/api/applicant");
  return data;
};

const addApplicant = async (newApplicant: ApplicantType) => {
  await axios.post("/api/applicant", newApplicant, {
    headers: { "Content-Type": "application/json" },
  });
};

const updateApplicant = async (updateApplicant: CardType) => {
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

export const useApplicantData = () => {
  const queryClient = useQueryClient();

  // Fetch Applicants
  const { data: applicants = [], isLoading, error } = useQuery({
    queryKey: ["applicants"],
    queryFn: fetchApplicants,
    staleTime: 5 * 60 * 1000, // 5 นาที ข้อมูลยัง "สด" ไม่ refetch
  });

  // Add Applicant
  const addMutation = useMutation({
    mutationFn: addApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] }); // รีเฟรชข้อมูล
    },
    onError: (error) => {
      console.error("Error adding applicant:", error);
    },
  });

  // Update Applicant
  const updateMutation = useMutation({
    mutationFn: updateApplicant,
    onMutate: async (updateApplicant) => {
      queryClient.cancelQueries({ queryKey: ["applicants"] });
      const previousApplicants = queryClient.getQueryData<CardType[]>(["applicants"]);
      queryClient.setQueryData(["applicants"], (oldApplicants: CardType[] = []) => {
        return oldApplicants.map((applicant) =>
          applicant.id === updateApplicant.id ? updateApplicant : applicant
        );
      })
      return { previousApplicants };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["applicants"], context?.previousApplicants);
    },

  });

  // Update Applicant Status
  const updateStatusMutation = useMutation({
    mutationFn: updateApplicantStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      const previousApplicants = queryClient.getQueryData<CardType[]>(["applicants"]);
      queryClient.setQueryData(["applicants"], (oldApplicants: CardType[] = []) => {
        return oldApplicants.map((applicant) =>
          applicant.id === id ? { ...applicant, status } : applicant
        );
      });

      return { previousApplicants };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousApplicants) {
        queryClient.setQueryData(["applicants"], context.previousApplicants); // rollback
      }
    },
  });

  // Delete Applicant
  const deleteMutation = useMutation({
    mutationFn: deleteApplicant,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["applicants"] });
      const previousApplicants = queryClient.getQueryData<CardType[]>(["applicants"]);
      queryClient.setQueryData(["applicants"], (oldApplicants: CardType[] = []) => {
        return oldApplicants.filter((applicant) => applicant.id !== id);
      });
      return { previousApplicants };
    },
    onError: (error, _variables, context) => {
      if (context?.previousApplicants) {
        queryClient.setQueryData(["applicants"], context.previousApplicants);
      }
    },
  });

  return {
    applicants,
    isLoading,
    error,
    fetchApplicants: () => queryClient.invalidateQueries({ queryKey: ["applicants"] }),
    addApplicant: addMutation.mutateAsync,
    updateApplicant: updateMutation.mutateAsync,
    updateApplicantStatus: updateStatusMutation.mutateAsync,
    deleteApplicant: deleteMutation.mutateAsync,
  };
};