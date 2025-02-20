// hooks/useExpenseData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Expense } from "@/schema/expenseFormSchema";

// Fetch all expenses (GET /api/expenses)
export const fetchExpenses = async () => {
  console.time("Fetch Expenses");
  const response = await axios.get<Expense[]>("/api/expenses");
  console.timeEnd("Fetch Expenses");
  return response.data;
};

// Fetch a single expense by ID (GET /api/expenses/:id)
export const fetchExpenseInfo = async ({ id }: { id: string }) => {
  const response = await axios.get<Expense>(`/api/expenses/${id}`);
  return response.data;
};

// Create a new expense (POST /api/expenses)
export const createExpense = async (data: Expense) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "attachment" && value instanceof File) {
      formData.append(key, value);
    } else if (key === "expenses" && value) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const response = await axios.post<Expense>("/api/expenses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update an expense (PATCH /api/expenses/:id)
export const updateExpense = async ({ id, data }: { id: string; data: Partial<Expense> }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "attachment" && value instanceof File) {
      formData.append(key, value);
    } else if (key === "expenses" && value) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const response = await axios.patch<Expense>(`/api/expenses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete an expense (DELETE /api/expenses/:id)
export const deleteExpense = async ({ id }: { id: string }) => {
  await axios.delete(`/api/expenses/${id}`);
  return { id };
};

// Hook to fetch all expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

// Hook to fetch a single expense by ID
export const useExpenseInfo = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => fetchExpenseInfo({ id }),
    enabled: !!id,
  });
};

// Hook to create a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.setQueryData(["expense", newExpense.id], newExpense);
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
    },
  });
};

// Hook to update an expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.setQueryData(["expense", updatedExpense.id], updatedExpense);
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
    },
  });
};

// Hook to delete an expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.removeQueries({ queryKey: ["expense", id] });
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
    },
  });
};