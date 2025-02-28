import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DayoffType } from "@/types/day-off"

const fetchDayOff = async () => {
  const response = await axios.get<DayoffType[]>("/api/dayoff");
  return response.data;
};

export const useDayOff = () => {
  return useQuery({
    queryKey: ["dayoff"],
    queryFn: fetchDayOff,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

export const useCreateDayOff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newDayOff: DayoffType) => {
      const response = await axios.post("/api/dayoff", newDayOff);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dayoff"] });
    },
  });
}

export const useUpdateStatusDayOff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await axios.patch(`/api/dayoff/`, { id, status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dayoff"] });
    },
  });
};

export const useUpdateDayOff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newData }: { id: string; newData: Partial<DayoffType> }) => {
      const response = await axios.patch(`/api/dayoff/${id}`, newData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dayoff"] });
    },
  });
};

export const useDeleteDayOff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/dayoff/`, { data: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dayoff"] });
    },
  });
}
