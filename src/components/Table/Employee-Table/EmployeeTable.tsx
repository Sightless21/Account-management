// EmployeesTable.tsx
"use client";

import { DataTable } from "@/components/Table/Data-Table";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { getColumns } from "./columns";
import { Role } from "@/types/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

interface EmployeesProps {
  userRole: Role;
}

export default function EmployeesTable({ userRole }: EmployeesProps) {
  const { data: employees, isLoading, error } = useEmployeeData();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Mutation สำหรับอัปเดต Role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ employeeId, newRole }: { employeeId: string; newRole: Role }) => {
      const response = await axios.patch("/api/employees/updateRole", { employeeId, newRole });
      if (!response.data.success) throw new Error("Failed to update role");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Role updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  // Mutation สำหรับลบพนักงาน
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await axios.delete(`/api/employees/${employeeId}`);
      if (!response.data.success) throw new Error("Failed to delete employee");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete employee: ${error.message}`);
    },
  });

  const columns = getColumns(userRole, {
    onRoleChange: (employeeId, newRole) => {
      updateRoleMutation.mutate({ employeeId, newRole }, {
        onSuccess: () => {
          if (currentUserId && employeeId === currentUserId) {
            toast.info("You have changed your own role. You will be logged out.");
            signOut({ callbackUrl: "/login" });
          }
        },
      });
    },
    onDelete: (employeeId) => {
      deleteEmployeeMutation.mutate(employeeId);
    },
    currentUserId,
    toast: (options) => {
      const {description, variant } = options;
      if (variant === "destructive") toast.error(description);
      else if (variant === "success") toast.success(description);
      else toast.info(description);
    },
  });

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading employees: {error.message}</div>;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={employees || []}
        searchColumn="employeeName"
        searchPlaceholder="Search employee name..."
        statusColumn="position"
        defaultVisibleColumns={["employeeName", "phone", "position", "expectSalary", "role", "actions"]}
      />
    </div>
  );
}