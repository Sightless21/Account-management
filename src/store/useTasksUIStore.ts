import { create } from "zustand";

interface TasksUIState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useTasksUIStore = create<TasksUIState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedPriority: " ",
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));