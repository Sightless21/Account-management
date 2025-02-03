/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// 1. External Libraries (เรียงตามตัวอักษร)
import { JSX, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiCancel, TiTick, TiEdit } from "react-icons/ti";
import { SquareUserRound, UserRoundPlus, UserPen, Eye } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
// 2. Internal Components (เรียงตามเส้นทางไฟล์)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePickerWithPresets } from "@/components/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

// 3. Internal Hooks & Utilities
import { useApplicantStore } from "@/hooks/useApplicantStore";

// 4. Schemas & Constants
import { formSchema } from "@/schema/formSchema";
import { APPLICANT_FORM_FIELDS, APPLICANT_FORM_DEFAULT_VALUES } from "@/schema/formApplicant";
interface ModalApplicantProps {
  mode: "create" | "edit" | "view";
  defaultValues?: z.infer<typeof formSchema>;
}
const DIALOG_CONFIG = {
  create: {
    buttonVariant: "default" as const,
    buttonLabel: "New Applicant",
    buttonIcon: <UserRoundPlus />,
    title: "New Applicant",
    description: "Fill in the form below to create a new applicant.",
  },
  edit: {
    buttonVariant: "link" as const,
    buttonLabel: "Edit Applicant",
    buttonIcon: <UserPen />,
    title: "Edit Applicant",
    description: "Modify the applicant information below.",
  },
  view: {
    buttonVariant: "link" as const,
    buttonLabel: "Read More",
    buttonIcon: <Eye />,
    title: "View Applicant",
    description: "Viewing applicant details.",
  },
};

export default function ModalApplicant({
  mode,
  defaultValues,
}: ModalApplicantProps) {
  // Initialize form using useForm hook with Zod validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all", // ✅ ตรวจสอบ validation แบบเรียลไทม์
    defaultValues: defaultValues || APPLICANT_FORM_DEFAULT_VALUES
  });
  // State to store applicant data
  const [applicants, setApplicants] = useState<z.infer<typeof formSchema>[]>([]);
  // ใช้ค่า mode จาก props โดยตรง
  const [currentMode, setCurrentMode] = useState(mode);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const config = useMemo(() => DIALOG_CONFIG[mode], [mode]);
  // ใช้ form โดยตรง
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);
  // เพิ่ม state สำหรับควบคุมโหมด
  // คำนวณค่าตรงๆ จาก props
  const isEditing = mode === "edit";
  // Destructure ค่าที่ต้องการในครั้งเดียว
  const { control, formState: { isValid, isDirty, errors }} = form;
  const { formState: { isSubmitting }} = form; // ใช้ isSubmitting จาก formState โดยตรง
  // ✅ เมื่อเปลี่ยน `isEditing` ให้ React อัปเดต UI
  useEffect(() => {
    console.log("Form is valid:", isValid);
  }, [isValid]);

  /**
   * Handles form submission and updates applicant state.
   * @param values - Form values
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 Form Data:", values); // ✅ ตรวจสอบค่าก่อนส่ง API
    setApplicants([...applicants, values]);
    if (!isValid) {
      console.log("Form is invalid!");
      return;
    }
    try {
      if (currentMode === "create") {
        toast.promise(
          useApplicantStore.getState().addApplicant(values),
          {
            loading: "Creating applicant...",
            success: "Applicant created",
            error: "Error creating applicant"
          }
        );
        console.log("Applicant created", values);
      } else if (currentMode === "edit" && isReadyToSave) {
        values.id = defaultValues?.id;
        toast.promise(
          useApplicantStore.getState().updateApplicant(values),
          {
            loading: "Updating applicant...",
            success: "Applicant updated",
            error: "Error updating applicant"
          }
        );
        console.log("Applicant updated", values);
        setCurrentMode("view")
        setIsReadyToSave(false);
      }
      form.reset(); // Reset fields to default values
      setApplicants([]);
    } finally {
      setIsReadyToSave(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={config.buttonVariant}>
          {config.buttonLabel}
          {mode === "create" && config.buttonIcon}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-20 w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>
        {/* Form layout */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Information Card */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>ข้อมูลส่วนตัว</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                {/* Iterate over info fields */}
                {Object.entries(APPLICANT_FORM_FIELDS.info).map(([key, value]) => {
                  if (key === "address") {
                    // Render address fields
                    return Object.values(value).map((item) => (
                      <FormField
                        key={item.id}
                        control={control}
                        name={
                          `info.address.${item.id}` as `info.address.${keyof typeof APPLICANT_FORM_FIELDS.info.address}`
                        }
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                            <Label>{item.label}</Label>
                            <FormMessage />
                            <FormControl>
                              <Input
                                className="h-5 w-40 text-center"
                                {...field}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ));
                  } else {
                    // Render other info fields
                    return (
                      <FormField
                        key={key}
                        control={control}
                        name={
                          `info.${key}` as `info.${keyof typeof APPLICANT_FORM_FIELDS.info}`
                        }
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                            {"label" in value && <Label>{value.label}</Label>}
                            <FormMessage />
                            <FormControl>
                              <Input
                                className="h-5 w-40 text-center"
                                {...field}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  }
                })}
                {/* Military Status Card */}
                <div className="flex w-full justify-between gap-4">
                  <Card className="w-full">
                    <CardHeader>
                      <CardDescription>ภาวะทางการทหาร</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {APPLICANT_FORM_FIELDS.military.map((item) => (
                        <FormField
                          key={item.id}
                          control={control}
                          name="itemsMilitary"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                              <FormControl>
                                <Checkbox
                                  className="mb-3"
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];
                                    return checked
                                      ? field.onChange([
                                        ...currentValue,
                                        item.id,
                                      ])
                                      : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                  }}
                                  disabled={
                                    currentMode === "view" && !isEditing
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.lable}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                  {/* Marital Status Card */}
                  <Card className="w-full">
                    <CardHeader>
                      <CardDescription>สถานภาพ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {APPLICANT_FORM_FIELDS.marital.map((item) => (
                        <FormField
                          key={item.id}
                          control={control}
                          name="itemsMarital"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                              <FormControl>
                                <Checkbox
                                  className="mb-3"
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];
                                    return checked
                                      ? field.onChange([
                                        ...currentValue,
                                        item.id,
                                      ])
                                      : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                  }}
                                  disabled={
                                    currentMode === "view" && !isEditing
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                  {/* Dwelling Status Card */}
                  <Card className="w-full">
                    <CardHeader>
                      <CardDescription>การอยู่อาศัย</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {APPLICANT_FORM_FIELDS.dwelling.map((item) => (
                        <FormField
                          key={item.id}
                          control={control}
                          name="itemsDwelling"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                              <FormControl>
                                <Checkbox
                                  className="mb-3"
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(
                                      field.value,
                                    )
                                      ? field.value
                                      : [];
                                    return checked
                                      ? field.onChange([
                                        ...currentValue,
                                        item.id,
                                      ])
                                      : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                  }}
                                  disabled={
                                    currentMode === "view" && !isEditing
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Documents and Personal Information */}
            <div className="col-span-2 grid grid-cols-5 gap-3">
              {/* Documents Card */}
              <Card className="col-span-2 overflow-y-auto">
                <CardHeader className="flex">
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>เอกสารสำหรับสมัครงาน</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {APPLICANT_FORM_FIELDS.doc.map((item) => (
                      <FormField
                        key={item.id}
                        control={control}
                        name="documents"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                                }}
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </div>
                  <div className="mt-10 flex justify-center">
                    <SquareUserRound size={70} />
                  </div>
                </CardContent>
              </Card>
              {/* Personal Information Card */}
              <Card className="col-span-3">
                <CardHeader className="flex">
                  <CardTitle>Personal</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {APPLICANT_FORM_FIELDS.person.map((item) => (
                    <FormField
                      key={item.id}
                      control={control}
                      name={`person.${item.id}`}
                      render={({ field }) => (
                        <FormItem key={item.id}>
                          <div className="flex justify-between">
                            <FormLabel>{item.label}</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input
                              placeholder={item.placeholder}
                              {...field}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              disabled={currentMode === "view" && !isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  {/* Birthdate Field */}
                  <FormField
                    control={control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Birth Date</FormLabel>
                          <FormMessage />
                        </div>
                        <FormControl>
                          <DatePickerWithPresets
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(date.toISOString())
                            }
                            disabled={currentMode === "view" && !isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Submit and Cancel Buttons */}
            <div className="col-span-2 grid">
              <div className="flex justify-end gap-2">
                {(() => {
                  const modeButtons: Record<string, JSX.Element> = {
                    create: (
                      <Button
                        type="submit"
                        disabled={!isValid}
                        onClick={() => form.handleSubmit(onSubmit)()}
                      >
                        <TiTick /> Create Applicant
                      </Button>
                    ),
                    edit: (
                      <Button
                        type="submit"
                        disabled={!isValid}
                        onClick={() => setIsReadyToSave(true)}
                      >
                        <TiTick /> Save Changes
                      </Button>
                    ),
                    view: (
                      <Button type="button" onClick={() => setCurrentMode("edit")}>
                        <TiEdit /> Edit
                      </Button>
                    ),
                  };

                  return modeButtons[currentMode] || null;
                })()}

                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    <TiCancel /> Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
