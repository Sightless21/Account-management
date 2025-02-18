// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ExpenseFormValues } from "@/schema/expenseFormSchema"

export const fetchExpenses = async () => {
  const response = await axios.get<ExpenseFormValues[]>("/api/expense");
  console.timeEnd("Fetch Expenses");
  return response.data;
};

export const fetchExpensesInfo = async ({ id }: { id: string }) => {
  const response = await axios.get<ExpenseFormValues>(`/api/expense/${id}`)
  return response.data
}

export const useExpensesInfo = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpensesInfo({ id }),
    enabled: !!id,
  });
}

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 0,
    refetchInterval: 30000, // ดึงข้อมูลใหม่ทุก 30 วินาที
    refetchOnWindowFocus: true, // ดึงข้อมูลใหม่เมื่อเปลี่ยน Tab,
  });
};