import { useQuery} from "@tanstack/react-query";
import axios from "axios";
import { Task } from "@/types/projects";

const fetchTasks = async () => {
  const { data } = await axios.get<Task[]>("/api/tasks");
  return data;
};

export const useTask = () => {
  
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    refetchInterval: 5 * 60 * 1000,
  });
};
