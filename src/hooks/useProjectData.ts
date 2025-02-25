import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Project, Task } from "@/types/projects";

//DONE : Fetching Project React-Query
export const fetchProjects = async () => {
  const response = await axios.get<Project[]>("/api/project");
  return response.data;
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};

// Add new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject: Project) => {
      const response = await axios.post("/api/project", newProject);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// Update project name
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, NewNameProject }: { id: string; NewNameProject: string }) => {
      const response = await axios.patch(`/api/project/`, { id, projectName: NewNameProject });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/project/?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useTask = (projectID: string | null) => {
  return useQuery({
    queryKey: ["tasks", projectID], // ✅ ใช้ projectID เป็น key เพื่อแยก cache
    queryFn: async () => {
      if (!projectID) return []; // ✅ ป้องกัน fetch โดยไม่จำเป็น
      const response = await axios.get<{ task: Task[] }>(`/api/project/${projectID}`);
      return response.data.task; // ✅ ดึงเฉพาะ `task[]` ออกมา
    },
    enabled: !!projectID, // ✅ หยุด fetch ถ้าไม่มี projectID
    staleTime: 1000 * 60 * 5, // ✅ Cache data for 5 minutes
  });
};
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newTask }: { id: string; newTask: Task }) => {
      const response = await axios.post(`/api/project/${id}`, newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taskName, status, priority, description }: Task) => {
      const response = await axios.patch(`/api/project/${id}`, {
        taskName,
        status,
        priority,
        description
      });
      return response.data;
    },
    onMutate: async (updateTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) => {
        return oldTasks.map((task) =>
          task.id === updateTask.id ? updateTask : task
        );
      })
      return { previousTasks };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });
};


export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/tasks/${id}`); // ✅ ใช้ URL ที่ถูกต้อง
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) => {
        return oldTasks.filter((task) => task.id !== id);
      });
      return { previousTasks };
    },
  });
};
