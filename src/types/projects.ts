export type StatusTasks = "TODO" | "DOING" | "DONE";
export type PriorityTasks = "HIGH" | "MEDIUM" | "LOW";

export type Task = {
  id: string;
  status: StatusTasks;
  taskName: string;
  description: string;
  dueDate: Date | string;
  priority: PriorityTasks;
  projectId: string;
  assignee: string;
}

export type Project = {
  id: string;
  projectName: string;
  task: Task[];
}

export type ChartData = {
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