'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RoombookingType } from "@/types/room-bookings"
import { roomBookingFormSchema } from "@/schema/formRoomBooking"
import z from "zod"

// ฟังก์ชัน fetch ข้อมูลการจองห้อง
const fetchRoombookings = async () => {
  const response = await axios.get<RoombookingType[]>("/api/roombooking");
  return response.data;
};

export const useRoomBookings = () => {
  return useQuery({
    queryKey: ["roombookings"],
    queryFn: fetchRoombookings,
    refetchInterval: 5 * 60 * 1000,
  });
}
export const useCreateRoomBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roombooking: z.infer<typeof roomBookingFormSchema>) => {
      const response = await axios.post("/api/roombooking", roombooking);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roombookings"] }); // Refresh ข้อมูล
    },
  });
}

export const useUpdateRoomBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roombooking: z.infer<typeof roomBookingFormSchema>) => {
      const response = await axios.patch(`/api/roombooking/${roombooking.id}`, roombooking);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roombookings"] });
    },
  });
}

export const useDeleteRoomBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/roombooking/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roombookings"] });
    },
  });
}