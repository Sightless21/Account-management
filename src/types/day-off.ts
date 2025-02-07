export type LeaveType = 'Vacation' | 'Sick' | 'Personal' | 'Maternity'
export type LeaveStatus = "Pending" | "Approved" | "Rejected"
export type UserRole = "EMPLOYEE" | "HR" | "MANAGER"

export interface DayoffType {
  id: string
  userId: string
  employeeName: string
  leaveType: LeaveType
  date: {
    from: Date
    to: Date
  }
  status: LeaveStatus
}