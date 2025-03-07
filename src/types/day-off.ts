export type LeaveType = 'Vacation' | 'Sick' | 'Personal' | 'Maternity'
export type LeaveStatus = "Pending" | "Accepted" | "Declined"
export type UserRole = "EMPLOYEE" | "HR" | "MANAGER" | "ADMIN"

export interface DayoffType {
  id: string;
  userId: string;
  employeeName: string;
  leaveType: 'Vacation' | 'Sick' | 'Personal' | 'Maternity';
  status: "Pending" | "Accepted" | "Declined";
  date: {
    from: Date;
    to: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}