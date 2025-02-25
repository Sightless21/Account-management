export type StatusTasks = "todo" | "doing" | "done";
export interface Task {
  id: string;
  status: StatusTasks;
  taskName: string;
  description: string;
  priority: string;
  projectId: string;
}

export interface Project {
  id: string;
  projectName: string;
  task: Task[];
}

export interface ChartData {
  projectId: string;
  projectName: string;
  chartData: {
    name: string;
    value: number;
    fill: string;
  }[];
  chartConfig: {
    value: { label: string };
  };
  donePercentage: number;
  doneAngle: number;
  totalTasks: number;
  doneTasks: number;
}