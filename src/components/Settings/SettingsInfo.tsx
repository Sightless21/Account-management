"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SettingsForm } from "@/schema/formSettings"
import { UseFormReturn } from "react-hook-form"

interface SettingsInfoProps {
  form: UseFormReturn<SettingsForm>
  defaultValues: SettingsForm
}

export default function SettingsInfo({ form, defaultValues }: SettingsInfoProps) {
  const { register, formState: { errors } } = form

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
                  <CardDescription>You can change your employee information</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...register("fullName")}
                        defaultValue={defaultValues.fullName}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        defaultValue={defaultValues.email}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        defaultValue={defaultValues.phone}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        {...register("position")}
                        defaultValue={defaultValues.position}
                      />
                      {errors.position && (
                        <p className="text-sm text-red-500">{errors.position.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 grid-cols-3">
                <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
                  <CardHeader>
                    <CardTitle>Military Status</CardTitle>
                    <CardDescription>Your military service status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue={defaultValues.militaryStatus}
                      {...register("militaryStatus")}
                    >
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
                    {errors.militaryStatus && (
                      <p className="text-sm text-red-500">{errors.militaryStatus.message}</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
                  <CardHeader>
                    <CardTitle>Marital Status</CardTitle>
                    <CardDescription>Your current marital status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue={defaultValues.maritalStatus}
                      {...register("maritalStatus")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="married" id="married" />
                        <Label htmlFor="married">Married</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="divorced" id="divorced" />
                        <Label htmlFor="divorced">Divorced</Label>
                      </div>
                    </RadioGroup>
                    {errors.maritalStatus && (
                      <p className="text-sm text-red-500">{errors.maritalStatus.message}</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Living Situation</CardTitle>
                    <CardDescription>Your current living arrangement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue={defaultValues.livingSituation}
                      {...register("livingSituation")}
                    >
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
                    {errors.livingSituation && (
                      <p className="text-sm text-red-500">{errors.livingSituation.message}</p>
                    )}
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
                      <Input
                        id="address"
                        {...register("houseNo")}
                        defaultValue={defaultValues.houseNo}
                      />
                      {errors.houseNo && (
                        <p className="text-sm text-red-500">{errors.houseNo.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-4">
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        {...register("street")}
                        defaultValue={defaultValues.street}
                      />
                      {errors.street && (
                        <p className="text-sm text-red-500">{errors.street.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        {...register("district")}
                        defaultValue={defaultValues.district}
                      />
                      {errors.district && (
                        <p className="text-sm text-red-500">{errors.district.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="subdistrict">Sub-district</Label>
                      <Input
                        id="subdistrict"
                        {...register("subdistrict")}
                        defaultValue={defaultValues.subdistrict}
                      />
                      {errors.subdistrict && (
                        <p className="text-sm text-red-500">{errors.subdistrict.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        {...register("province")}
                        defaultValue={defaultValues.province}
                      />
                      {errors.province && (
                        <p className="text-sm text-red-500">{errors.province.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-3">
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input
                        id="postal"
                        {...register("postalCode")}
                        defaultValue={defaultValues.postalCode}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        {...register("nationality")}
                        defaultValue={defaultValues.nationality}
                      />
                      {errors.nationality && (
                        <p className="text-sm text-red-500">{errors.nationality.message}</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="religion">Religion</Label>
                      <Input
                        id="religion"
                        {...register("religion")}
                        defaultValue={defaultValues.religion}
                      />
                      {errors.religion && (
                        <p className="text-sm text-red-500">{errors.religion.message}</p>
                      )}
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
                        <Checkbox
                          id="doc1"
                          {...register("documents.nationalIdCard")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc1">National ID Card Copy</Label>
                          <p className="text-sm text-muted-foreground">
                            Clear copy of your national ID card (front and back)
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doc2"
                          defaultChecked={defaultValues.documents?.houseRegistration}
                          {...register("documents.houseRegistration")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc2">House Registration Copy</Label>
                          <p className="text-sm text-muted-foreground">Official copy of your house registration document</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doc3"
                          defaultChecked={defaultValues.documents?.bankAccountDetails}
                          {...register("documents.bankAccountDetails")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc3">Bank Account Details</Label>
                          <p className="text-sm text-muted-foreground">Copy of bank book or bank statement</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doc4"
                          defaultChecked={defaultValues.documents?.educationalCertificates}
                          {...register("documents.educationalCertificates")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc4">Educational Certificates</Label>
                          <p className="text-sm text-muted-foreground">
                            Copies of your educational certificates and transcripts
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doc5"
                          defaultChecked={defaultValues.documents?.resume}
                          {...register("documents.resume")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="doc5">Resume/CV</Label>
                          <p className="text-sm text-muted-foreground">Updated resume or curriculum vitae</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  {errors.documents && (
                    <p className="text-sm text-red-500 mt-2">Please check the required documents</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}