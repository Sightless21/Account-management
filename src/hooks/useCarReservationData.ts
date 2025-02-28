import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CarReservationType } from "@/types/car-reservation"

export const fetchCarReservation = async () => {
  const response = await axios.get<CarReservationType[]>("/api/car-Reservation");
  return response.data;
};

export const useCarReservation = () => {
  return useQuery({
    queryKey: ["car-reservation"],
    queryFn: fetchCarReservation,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCarReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carReservation: CarReservationType) => {
      const response = await axios.post("/api/car-Reservation", carReservation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["car-reservation"] });
    },
  });
};

export const useUpdateCarReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carReservation: CarReservationType) => {
      const response = await axios.patch(`/api/car-Reservation/${carReservation.id}`, carReservation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["car-reservation"] });
    },
  });
};

export const useDeleteCarReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/car-Reservation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["car-reservation"] });
    },
  });
};