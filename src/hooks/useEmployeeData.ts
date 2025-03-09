import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Employee } from "@/types/employee";

const fetchEmployees = async () => {
  const response = await axios.get<Employee[]>("/api/employees");
  if (!response.data) throw new Error("No data returned");
  return response.data;
};

export const useEmployeeData = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};