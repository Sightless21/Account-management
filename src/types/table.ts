import { ColumnMeta as TanStackColumnMeta } from "@tanstack/react-table";

export interface CustomColumnMeta<TData, TValue> extends TanStackColumnMeta<TData, TValue> {
  title?: string; // Add title property
}