import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Project, Task } from "@/types/projects";
import { toast } from "sonner";


const fetchProjects = async () => {
  const { data } = await axios.get<Project[]>("/api/project");
  return data;
};

const createProject = async (newProject: Project) => {
  try {
    const res = await axios.post("/api/project", newProject);
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const updateProject = async ({ id, NewNameProject, newDescriptionProject }: { id: string; NewNameProject: string, newDescriptionProject: string }) => {
  try {
    const res = await axios.patch("/api/project", { 
      id, 
      projectName: NewNameProject, 
      description: newDescriptionProject });
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const deleteProject = async (id: string) => {
  try {
    const res = await axios.delete(`/api/project/?id=${id}`)
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const invalidateProjects = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["projects"] });
}

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    refetchInterval: 5 * 60 * 1000,
  });
};
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => invalidateProjects(queryClient),
  });
};
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => invalidateProjects(queryClient),
  });
};
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => invalidateProjects(queryClient),
  });
};



const fetchTasks = async (projectID: string) => {
  try {
    const res = await axios.get<Project>(`/api/project/${projectID}`);
    console.log("Full Project Response:", res.data);
    const tasks = res.data.task;
    const formatdate = tasks.map((task: Task) => {
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        task.dueDate = formattedDate;
      }
      return task;
    })
    console.log("Filtered Tasks:", formatdate);
    return formatdate;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const createTask = async ({ id, newTask }: { id: string; newTask: Task }) => {
  try {
    const res = await axios.post(`/api/project/${id}`, newTask);
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const updateTask = async ({ newTask }: { newTask: Task }) => {
  try {
    const res = await axios.patch(`/api/project/${newTask.id}`, {
      taskName: newTask.taskName,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate ? newTask.dueDate : undefined,
      assignee: newTask.assignee,
      order: newTask.order, // เพิ่ม order
    });
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
const deleteTask = async (id: string) => {
  try {
    const res = await axios.delete(`/api/project/${id}`);
    console.log("API response:", res.status);
    return res.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
const invalidateTasks = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
}

export const useTask = (projectID: string | null) => {
  return useQuery({
    queryKey: ["tasks", projectID],
    queryFn: () => fetchTasks(projectID || ""),
    enabled: !!projectID,
    refetchInterval: 5 * 60 * 1000,
  });
};
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => invalidateTasks(queryClient),
  });
}
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async ({ newTask }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", newTask.projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", newTask.projectId]);
      queryClient.setQueryData(["tasks", newTask.projectId], (oldTasks: Task[] = []) =>
        oldTasks.map((task) => (task.id === newTask.id ? newTask : task))
      );
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error, { newTask }, context) => {
      queryClient.setQueryData(["tasks", newTask.projectId], context?.previousTasks);
      toast.error("Failed to update task: " + error.message);
    },
  });
};
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) => {
        return oldTasks.filter((task) => task.id !== id);
      });
      return { previousTasks };
    },
    onSettled: () => invalidateTasks(queryClient),
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    }
  });
};
