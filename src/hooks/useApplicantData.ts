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
  await axios.patch("/api/applicant", { id, status }, { // เปลี่ยน endpoint เป็น /api/applicant
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] }); // รีเฟรชข้อมูล
    },
    onError: (error) => {
      console.error("Error updating applicant:", error);
    },
  });

  // Update Applicant Status
  const updateStatusMutation = useMutation({
    mutationFn: updateApplicantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] }); // รีเฟรชข้อมูล
    },
    onError: (error) => {
      console.error("Error updating applicant status:", error);
    },
  });

  // Delete Applicant
  const deleteMutation = useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] }); // รีเฟรชข้อมูล
    },
    onError: (error) => {
      console.error("Error deleting applicant:", error);
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