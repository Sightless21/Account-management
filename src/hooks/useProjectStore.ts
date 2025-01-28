import { create } from "zustand";
import axios from "axios";

interface Project {
    id: string;
    projectName: string;
    task: Task[];
}

interface Task {
    id: string;
    status: string;
    description: string;
    priority: string;
}

interface ProjectStore {
    projects: Project[];
    fetchProjects: () => Promise<void>; //Get all projects and Task in Project
    addProject: (newProject: Project) => Promise<void>; //Add new project with empty task
    deleteProject: (id: string) => Promise<void>; //Delete project with all task
    updateProject: (id: string, updatedProject: Project) => Promise<void>; //Update project (Project Name)
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [],
    fetchProjects: async () => {
        try {
            const response = await axios.get<Project[]>("/api/project");
            set({ projects: response.data });
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    },
    addProject: async (newProject: Project) => {
        try {
            const response = await axios.post("/api/project", newProject);
            set((state) => ({ projects: [...state.projects, response.data] }));
            useProjectStore.getState().fetchProjects();
        } catch (error) {
            console.error("Error adding project:", error);
        }
    },
    updateProject: async (id: string, updatedProject: Project) => {
        try {
            const response = await axios.patch(`/api/project/${id}`, updatedProject);
            set((state) => ({
                projects: state.projects.map((project) =>
                    project.id === id ? response.data : project
                ),
            }));
            useProjectStore.getState().fetchProjects();
        } catch (error) {
            console.error("Error updating project:", error);
        }
    },
    deleteProject: async (id: string) => {
        try {
            await axios.delete(`/api/project/${id}`);
            set((state) => ({
                projects: state.projects.filter((project) => project.id !== id),
            }));
            useProjectStore.getState().fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    },
}));