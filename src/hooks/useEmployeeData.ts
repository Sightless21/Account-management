import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { EmployeeList , Employee } from "@/types/employee"

const fetchEmployees = async () => {
  const response = await axios.get<Employee[]>("/api/employee");
  return response.data;
};

export const useEmployeeData = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    refetchInterval: 5 * 60 * 1000,
  });
};
