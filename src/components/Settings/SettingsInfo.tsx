'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export default function SettingsInfo() {


  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-none">
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="address">Address Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your main profile information used across the platform</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Mr. Messi" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="po.fegmpwegt@tni.ac.th" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="0990798261" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue="Front-end Developer" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-none md:border-r md:border-gray-200">
                  <CardHeader>
                    <CardTitle>Military Status</CardTitle>
                    <CardDescription>Your military service status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="Exempted">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Exempted" id="military1" />
                        <Label htmlFor="military1">Exempted</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Not Exempted" id="military2" />
                        <Label htmlFor="military2">Not Exempted</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Pending" id="military3" />
                        <Label htmlFor="military3">Pending</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-none md:border-r md:border-gray-200">
                  <CardHeader>
                    <CardTitle>Marital Status</CardTitle>
                    <CardDescription>Your current marital status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="single">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="Marital1">Single</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="married" id="married" />
                        <Label htmlFor="Marital2">Married</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="divorced" id="divorced" />
                        <Label htmlFor="Marital3">Divorced</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Living Situation</CardTitle>
                    <CardDescription>Your current living arrangement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="With Family">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="With Family" id="living1" />
                        <Label htmlFor="living1">With Family</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Own Property" id="living2" />
                        <Label htmlFor="living2">Own Property</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Renting" id="living3" />
                        <Label htmlFor="living3">Renting</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Condo" id="living4" />
                        <Label htmlFor="living4">Condo</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="address">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Your residential address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-6">
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="address">House No.</Label>
                      <Input id="address" defaultValue="211/2" />
                    </div>
                    <div className="grid gap-2 sm:col-span-4">
                      <Label htmlFor="street">Street</Label>
                      <Input id="street" defaultValue="เพชรบุรี" />
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" defaultValue="บางกระปิ" />
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="subdistrict">Sub-district</Label>
                      <Input id="subdistrict" defaultValue="พระโขนง" />
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" defaultValue="กรุงเทพมหานคร" />
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input id="postal" defaultValue="10250" />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input id="nationality" defaultValue="Thai" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="religion">Religion</Label>
                      <Input id="religion" defaultValue="Buddhist" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Please ensure all required documents are submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="doc1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc1">National ID Card Copy</Label>
                          <p className="text-sm text-muted-foreground">
                            Clear copy of your national ID card (front and back)
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="doc2" defaultChecked />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc2">House Registration Copy</Label>
                          <p className="text-sm text-muted-foreground">Official copy of your house registration document</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="doc3" defaultChecked />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc3">Bank Account Details</Label>
                          <p className="text-sm text-muted-foreground">Copy of bank book or bank statement</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="doc4" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc4">Educational Certificates</Label>
                          <p className="text-sm text-muted-foreground">
                            Copies of your educational certificates and transcripts
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="doc5" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc5">Resume/CV</Label>
                          <p className="text-sm text-muted-foreground">Updated resume or curriculum vitae</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}