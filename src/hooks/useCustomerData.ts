import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {Customer} from "@/schema/formCustomer"

//TODO : Fetching Customer React-Query
export const fetchCustomer = async () => {
  const response = await axios.get<Customer[]>("/api/customer");
  return response.data;
};

export const fetchCustomerInfo = async ({id} : {id : string}) => {
  const response = await axios.get<Customer>(`/api/customer/${id}`)
  return response.data
}

export const useCustomerInfo = ({id} : {id : string}) => {
  return useQuery({
    queryKey: ["customer",id],
    queryFn: () => fetchCustomerInfo({id}),
    enabled: !!id,
  })
}

export const useCustomer = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomer,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customer: Customer) => {
      const response = await axios.post("/api/customer", customer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customer: Customer) => {
      const response = await axios.patch(`/api/customer/${customer.id}`, customer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["customers"] });
    }
  });
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/customer/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ["customers"] });
    },
  })
} 