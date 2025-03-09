// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/types/users";
import { DataTableColumnHeader } from "@/components/Table/ColumnHeader";
import { Employee } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeActions } from "./EmployeeActions";
import { RoleChangeDialog } from "@/components/Table/Employee-Table/RoleChangeDialog";

interface ColumnProps {
  onRoleChange: (employeeId: string, newRole: Role) => void;
  onDelete: (employeeId: string) => void;
  currentUserId?: string;
  toast: (options: { title: string; description: string; variant?: string }) => void;
}

export const getColumns = (
  role: Role,
  { onRoleChange, onDelete, currentUserId, toast }: ColumnProps
): ColumnDef<Employee>[] => {
  const baseColumns: ColumnDef<Employee>[] = [
    {
      id: "employeeName",
      accessorKey: "person.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Name" />,
      cell: ({ row }) => {
        const { profileImage, firstName, lastName, isVerify, email } = row.original.user;
        const { name } = row.original.person;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-2xl">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="rounded-2xl">
                {firstName[0] + lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p>{name}</p>
                <Badge variant={isVerify ? "default" : "secondary"}>
                  {isVerify ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
      meta: { title: "Employee Name" },
    },
    {
      id: "phone",
      accessorKey: "person.phone",
      header: "Phone",
      meta: { title: "Phone" },
    },
    {
      id: "role",
      accessorKey: "user.role",
      header: "Role",
      cell: ({ row }) => {
        const initialRole = row.original.user.role;
        const employeeName = row.original.person.name;
        const employeeId = row.original.user.id;
        const isSelf = currentUserId === employeeId;

        const handleRoleChange = (newRole: Role) => {
          // ป้องกันการเปลี่ยน Role ของตัวเอง
          if (isSelf) {
            toast({
              title: "Error",
              description: "You cannot change your own role",
              variant: "destructive",
            });
            return;
          }
          onRoleChange(employeeId, newRole);
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge className="capitalize cursor-pointer" variant={"outline"}>
                  {initialRole}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["MANAGER", "EMPLOYEE", "HR", "ADMIN"].map((roleOption) => {
                  const isDisabled = isSelf && roleOption !== initialRole; // ป้องกันเปลี่ยน Role ของตัวเอง
                  return (
                    <DropdownMenuItem
                      key={roleOption}
                      onClick={() => handleRoleChange(roleOption as Role)}
                      className={roleOption === initialRole ? "bg-gray-200 dark:bg-gray-700" : ""}
                      disabled={isDisabled}
                    >
                      {roleOption}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {initialRole !== row.original.user.role && (
              <RoleChangeDialog
                employeeName={employeeName}
                newRole={initialRole as Role} 
              />
            )}
          </>
        );
      },
      meta: { title: "Role" },
    },
    {
      id: "position",
      accessorKey: "person.position",
      header: "Position",
      meta: { title: "Position" },
    },
    {
      id: "expectSalary",
      accessorKey: "person.expectSalary",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Salary" isNumeric />,
      cell: ({ row }) => {
        const salary = row.original.person.expectSalary;
        return salary ? `${Number(salary).toLocaleString("th-TH")} THB` : "-";
      },
      meta: { title: "Salary" },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <EmployeeActions
          row={row}
          onDelete={() => onDelete(row.original.user.id)}
        />
      ),
    },
  ];

  switch (role) {
    case "EMPLOYEE":
      return baseColumns.filter((col) => col.id !== "actions"); // จำกัดสิทธิ์
    case "HR":
      return baseColumns;
    case "MANAGER":
      return baseColumns;
    case "ADMIN":
      return baseColumns;
    default:
      return baseColumns;
  }
};