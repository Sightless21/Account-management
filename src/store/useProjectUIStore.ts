import { create } from "zustand";

//DONE : Project UI Store Zustand
interface ProjectUIState {
  sortOption: string;
  searchQuery: string;
  currentPage: number;
  setSortOption: (option: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useProjectUIStore = create<ProjectUIState>((set) => ({
  sortOption: "Order by",
  searchQuery: "",
  currentPage: 1,
  setSortOption: (option) => set({ sortOption: option }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));