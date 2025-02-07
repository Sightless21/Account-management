/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DayoffType, LeaveType, UserRole } from "@/types/day-off"
import { useDayOff } from "@/hooks/useDayOffData"

interface LeaveTableProps {
  userRole: UserRole
}

export function LeaveTable({ userRole }: LeaveTableProps) {
  const [isAddingLeave, setIsAddingLeave] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState<DayoffType[]>([
    {
      id: "1",
      userId: "",
      employeeName: "Firstname Lastname",
      leaveType: "Sick",
      date: {
        from: new Date("2024-03-15T14:30:00Z"),
        to: new Date("2024-03-15T14:30:00Z"),
      },
      status: "Pending",
    },
    // Add more mock data as needed
  ])

  const { data: dayoffs, isLoading } = useDayOff()

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee name</TableHead>
              <TableHead>Leave type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dayoffs?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employeeName}</TableCell>
                <TableCell>{request.leaveType}</TableCell>
                <TableCell>
                  {format(new Date("2024-03-15T14:30:00Z"), "yyyy-MM-dd")} - {" "}
                  {format(new Date("2024-03-15T14:30:00Z"), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  {(userRole === "MANAGER" || userRole === "HR") && request.status === "Pending" ? (
                    <div className="flex gap-2">
                      {/* <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(request.id, "Approved")}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(request.id, "Rejected")}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button> */}
                    </div>
                  ) : 
                  (
                    <span
                      className={
                        request.status === "Approved"
                          ? "text-green-500"
                          : request.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

