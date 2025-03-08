import { ColumnDef } from "@tanstack/react-table"
import { Role } from "@/types/users"
import { DataTableColumnHeader } from "@/components/Table/ColumnHeader"
import { Employee } from "@/types/employee"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export const getColumns = (role: Role): ColumnDef<Employee>[] => {
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
                <Badge variant={isVerify ? "default" : "secondary"}>{isVerify ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        )
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
        const { role } = row.original.user;
        return (
          <Badge className="capitalize" variant={"outline"}>
            {role}
          </Badge>
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
  ];

  switch (role) {
    case "EMPLOYEE":
      return [...baseColumns];
    case "HR":
      return [...baseColumns];
    case "MANAGER":
      return [...baseColumns];
    case "ADMIN":
      return [...baseColumns];
    default:
      return baseColumns;
  }
};