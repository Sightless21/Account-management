import { create } from "zustand";

interface TaskStore {
  taskLength: number;
  setTaskLength: (count: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  taskLength: 0, // ค่าตั้งต้น
  setTaskLength: (count) => set({ taskLength: count }),
}));