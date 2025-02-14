import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Car } from "@/types/car-reservation"

export const fetchCars = async () => {
  const response = await axios.get<Car[]>("/api/car");
  return response.data;
};

export const useCar = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (car: Car) => {
      const response = await axios.post("/api/car", car);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["cars"] });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (car: Car) => {
      const response = await axios.put(`/api/car/${car.id}`, car);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["cars"] });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/car/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["cars"] });
    },
  });
};