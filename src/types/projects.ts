export type StatusTasks = "TODO" | "DOING" | "DONE";
export type PriorityTasks = "HIGH" | "MEDIUM" | "LOW";
export type StageStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED"

export type Task = {
  id: string;
  status: StatusTasks;
  taskName: string;
  description: string;
  dueDate: Date | string;
  priority: PriorityTasks;
  projectId: string;
  assignee: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Project = {
  id: string;
  projectName: string;
  description: string;
  task: Task[];
  createdAt: Date;
  updatedAt: Date;
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

export type ProjectStage =  {
  id: string;
  title: string;
  description: string;
  status: StageStatus;
  startDate: Date;
  endDate: Date;
  progress: number;
  projectId: string;
}