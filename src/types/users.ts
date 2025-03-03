export type Role = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isVerify: boolean;
  profileImage : string;
};