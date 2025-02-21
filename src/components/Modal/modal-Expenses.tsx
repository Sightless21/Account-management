"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Clock, DollarSign, MapPin } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Expense } from "@/schema/expenseFormSchema";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";

export interface ExpenseDialogProps {
  expense: Expense;
  onClose?: () => void;
  trigger?: React.ReactNode;
  open?: boolean; // Add open prop
}

export function ExpenseDialog({ expense, onClose, trigger, open }: ExpenseDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasContent = (obj: Record<string, any> | undefined) => {
    if (!obj) return false;
    return Object.keys(obj).length > 0 && Object.values(obj).some((value) => value !== null && value !== undefined);
  };

  const calculateTotal = () => {
    const { expenses } = expense
    return Object.values(expenses).reduce((total, exp) => {
      if (exp && ("totalCost" in exp || "amount" in exp)) {
        return total + (("totalCost" in exp ? exp.totalCost : 0) + ("amount" in exp ? exp.amount : 0))
      }
      return total
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
          <DialogDescription>
            Expense report for {expense.employeeName} on {formatDate(expense.transactionDate)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Primary Information Card */}
              <div className="flex flex-col space-x-4">
                <div className="span-col-2 flex items-center space-x-4 space-y-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={expense.employeeName} />
                    <AvatarFallback>
                      {expense.employeeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{expense.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{expense.title}</p>
                  </div>
                </div>
                {/* Secondary Information */}
                <div className="grid gap-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(expense.transactionDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{expense.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expense.useForeignCurrency ? "Foreign Currency" : "Local Currency"}</span>
                  </div>
                  <Badge className="justify-self-start" variant={expense.status === "Pending" ? "secondary" : "default"}>{expense.status}</Badge>
                </div>
              </div>
              {/* Description */}
              <div className="mt-4">
                <h4 className="mb-2 mt-1 font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground">{expense.description}</p>
              </div>
            </div>
            <Separator />
            {/* Expenses */}
            <div>
              <h4 className="mb-4 font-semibold">Expenses Summary</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasContent(expense.expenses.fuel) && (
                    <TableRow>
                      <TableCell className="font-medium">Fuel</TableCell>
                      <TableCell className="text-muted-foreground">{expense.expenses.fuel!.liters} liters</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.expenses.fuel!.totalCost)}</TableCell>
                    </TableRow>
                  )}
                  {hasContent(expense.expenses.accommodation) && (
                    <TableRow>
                      <TableCell className="font-medium">Accommodation</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.expenses.accommodation!.nights} nights
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.expenses.accommodation!.totalCost)}
                      </TableCell>
                    </TableRow>
                  )}
                  {hasContent(expense.expenses.transportation) && (
                    <TableRow>
                      <TableCell className="font-medium">Transportation</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.expenses.transportation!.origin} to {expense.expenses.transportation!.destination}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.expenses.transportation!.totalCost)}
                      </TableCell>
                    </TableRow>
                  )}
                  {hasContent(expense.expenses.perDiem) && (
                    <TableRow>
                      <TableCell className="font-medium">Per Diem</TableCell>
                      <TableCell className="text-muted-foreground">Daily allowance</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.expenses.perDiem!.amount)}</TableCell>
                    </TableRow>
                  )}
                  {hasContent(expense.expenses.medicalExpenses) && (
                    <TableRow>
                      <TableCell className="font-medium">Medical</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.expenses.medicalExpenses!.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.expenses.medicalExpenses!.amount)}
                      </TableCell>
                    </TableRow>
                  )}
                  {hasContent(expense.expenses.otherExpenses) && (
                    <TableRow>
                      <TableCell className="font-medium">Other</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.expenses.otherExpenses!.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.expenses.otherExpenses!.amount)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(calculateTotal())}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <Separator />
            {/* Attachment */}
            <div>
              <h4 className="mb-2 font-semibold">Attachment</h4>
              <div className="flex justify-center">
                <Image
                  src={expense.attachmentUrl || "/placeholder.svg"}
                  alt="Expense attachment"
                  width={300}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Created: {formatDate(expense.createdAt)}
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Updated: {formatDate(expense.updatedAt)}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}