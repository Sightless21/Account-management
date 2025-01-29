import { create } from "zustand";
import axios from "axios";
import { CardType } from "@/components/DnDKanBan/types";

interface TaskStore {
  tasks: CardType[];
  fetchTasks: (projectID: string) => Promise<void>;
  createTask: (id: string, newTask: CardType) => Promise<void>;
  updateTasks: (updatedTask: CardType) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  fetchTasks: async (projectID: string) => {
    try {
      // เรียก API
      const { data } = await axios.get<{ task: CardType[] }>(
        `/api/project/${projectID}/`,
      );
      // ตรวจสอบและดึงเฉพาะ task[]
      const tasks = Array.isArray(data?.task) ? data.task : [];
      console.log("Fetched tasks:", tasks);
      // อัปเดต state
      set({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ tasks: [] }); // เคลียร์ tasks หากเกิดข้อผิดพลาด
    }
  },

  createTask: async (id: string, newTask: CardType) => {
    try {
      const { data } = await axios.post<CardType>(
        `/api/project/${id}`,
        newTask,
      );
      console.log("Added task:", data);
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },
  updateTasks: async (updatedTask: CardType) => {
    const { id, ...data } = updatedTask;
    const previousTasks = useTaskStore.getState().tasks;

    try {
      // ยิง API เพื่ออัปเดตข้อมูล
      await axios.patch(`/api/project/${id}`, data);
      console.log(`Task ID ${id} updated successfully`);

      // อัปเดต state ใน Zustand
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...data } : task,
        ),
      }));
    } catch (error) {
      console.error("Error updating task:", error);

      // Rollback หาก API ล้มเหลว
      set({ tasks: previousTasks });
    }
  },

  deleteTask: async (id: string) => {
    try {
      const task = useTaskStore.getState().tasks.find((t) => t.id === id);
      if (task?.projectId) {
        await axios.delete(`/api/project/${id}`);
        console.log(`Successfully deleted task with ID: ${id}`);
        // Fetch the latest tasks after deletion
        await useTaskStore.getState().fetchTasks(task.projectId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));
