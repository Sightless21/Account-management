// types.ts
export type ColumnType = "todo" | "doing" | "done";

export interface CardType {
    projectId: string;
    taskName: string;
    id: string;
    status: ColumnType;
    description: string;
    priority: string;
}