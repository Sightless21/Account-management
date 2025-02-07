import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DayoffType } from "@/types/day-off"

//DONE  : Fetching Day-off React-Query
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

// Add new Day-off
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
