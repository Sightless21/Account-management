import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CarReservationType } from "@/types/car-reservation"

//TODO : Fetching Car-Reservation React-Query
export const fetchCarReservation = async () => {
  const response = await axios.get<CarReservationType[]>("/api/car-reservation");
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
      const response = await axios.post("/api/car-reservation", carReservation);
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
      const response = await axios.put(`/api/car-reservation/${carReservation.id}`, carReservation);
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
      await axios.delete(`/api/car-reservation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["car-reservation"] });
    },
  });
};