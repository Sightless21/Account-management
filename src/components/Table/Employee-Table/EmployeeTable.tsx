'use client';

import { DataTable } from "@/components/Table/Data-Table";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { getColumns } from "./columns";
import { Role } from "@/types/users";

interface EmployeesProps {
  userRole: Role;
}
export default function EmployeesTable({ userRole }: EmployeesProps) {
  const { data: employees } = useEmployeeData();

  const columns = getColumns(userRole);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={employees || []}
        searchColumn="employeeName"
        searchPlaceholder="Search employee name..."
        statusColumn="position"
        defaultVisibleColumns={["employeeName", "phone", "position", "expectSalary", "actions"]} />
    </div>
  );
}