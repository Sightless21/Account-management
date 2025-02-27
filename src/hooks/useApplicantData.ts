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
    mutationFn: updateApplicantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"]});
    },
    onError: (error) => {
      console.error("Error updating applicant status:", error);
    }
  })
}

export const useDeleteApplicant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"]})
    }
  })
}