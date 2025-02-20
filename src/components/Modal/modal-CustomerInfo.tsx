"use client"

import type React from "react"

import {
  Building2,
  Contact2,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Building,
  Hash,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Customer } from "@/schema/formCustomer"

interface CustomerInfoProps {
  customer: Customer;
  trigger: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export default function CustomerDialogInfo({ customer, trigger, open, onClose }: CustomerInfoProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">{trigger}</Button>}</DialogTrigger>
      <DialogContent className="w-[1000px] h-[700px]">
        <DialogHeader className="flex justify-between">
            <DialogTitle>Information for {customer.companyName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">{customer.companyName}</h2>
                {customer.industry && (
                  <p className="text-muted-foreground">{customer.industry}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Information Card */}
              <div className="space-y-6 rounded-lg border p-6">
                <div>
                  <h3 className="font-semibold mb-1.5">Company Information</h3>
                  <p className="text-sm text-muted-foreground">Primary details and contact information</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium">{customer.companyName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Contact2 className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{customer.contactPerson}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">{customer.position}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tax ID</p>
                        <p className="font-medium">{customer.taxId}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {customer.address}
                        </p>
                      </div>
                    </div>

                    {customer.industry && (<div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{customer.industry}</p>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="space-y-6 rounded-lg border p-6">
                <div>
                  <h3 className="font-semibold mb-1.5">Contact Details</h3>
                  <p className="text-sm text-muted-foreground">Ways to reach the customer</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{customer.phoneNumber}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        Call
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        Email
                      </Button>
                    </div>

                    {customer.website && (<div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">{customer.website}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open(customer.website, "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit
                      </Button>
                    </div>)}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">
                      {customer.notes || "No notes available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

