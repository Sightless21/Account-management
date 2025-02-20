"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Clock, DollarSign, MapPin } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Expense } from "@/types/expense";

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
            <div className="flex items-center space-x-4">
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
              <div>
                <h3 className="text-lg font-semibold">{expense.employeeName}</h3>
                <p className="text-sm text-muted-foreground">{expense.title}</p>
              </div>
            </div>
            <div className="grid gap-2">
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
              <Badge variant={expense.status === "Pending" ? "secondary" : "default"}>{expense.status}</Badge>
            </div>
            <Separator />
            <div>
              <h4 className="mb-2 font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground">{expense.description}</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Expenses Breakdown</h4>
              <div className="grid gap-4">
                {hasContent(expense.expenses.fuel) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fuel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Liters: {expense.expenses.fuel!.liters}</p>
                      <p>Total Cost: {formatCurrency(expense.expenses.fuel!.totalCost)}</p>
                    </CardContent>
                  </Card>
                )}
                {hasContent(expense.expenses.accommodation) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Accommodation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Nights: {expense.expenses.accommodation!.nights}</p>
                      <p>Total Cost: {formatCurrency(expense.expenses.accommodation!.totalCost)}</p>
                    </CardContent>
                  </Card>
                )}
                {hasContent(expense.expenses.transportation) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transportation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Origin: {expense.expenses.transportation!.origin}</p>
                      <p>Destination: {expense.expenses.transportation?.destination}</p>
                      <p>Total Cost: {formatCurrency(expense.expenses.transportation!.totalCost)}</p>
                    </CardContent>
                  </Card>
                )}
                {hasContent(expense.expenses.perDiem) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Per Diem</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Amount: {formatCurrency(expense.expenses.perDiem!.amount)}</p>
                    </CardContent>
                  </Card>
                )}
                {hasContent(expense.expenses.medicalExpenses) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Amount: {formatCurrency(expense.expenses.medicalExpenses!.amount)}</p>
                      <p>Description: {expense.expenses.medicalExpenses?.description}</p>
                    </CardContent>
                  </Card>
                )}
                {hasContent(expense.expenses.otherExpenses) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Other Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Amount: {formatCurrency(expense.expenses.otherExpenses!.amount)}</p>
                      <p>Description: {expense.expenses.otherExpenses?.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <Separator />
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