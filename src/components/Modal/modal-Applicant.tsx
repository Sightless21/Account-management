/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// 1. External Libraries
import { JSX, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiCancel, TiTick, TiEdit } from "react-icons/ti";
import { SquareUserRound, UserRoundPlus, UserPen, Eye } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // เพิ่ม React Query

// 2. Internal Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePickerWithPresets } from "@/components/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// 3. Internal Hooks & Utilities
import { useApplicantData } from "@/hooks/useApplicantData"; // ใช้ hook React Query ใหม่

// 4. Schemas & Constants
import { formApplicantSchema, APPLICANT_FORM_FIELDS, APPLICANT_FORM_DEFAULT_VALUES } from "@/schema/formApplicant";

interface ModalApplicantProps {
  mode: "create" | "edit" | "view";
  defaultValues?: z.infer<typeof formApplicantSchema>;
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

export default function ModalApplicant({ mode, defaultValues }: ModalApplicantProps) {
  const form = useForm<z.infer<typeof formApplicantSchema>>({
    resolver: zodResolver(formApplicantSchema),
    mode: "all",
    defaultValues: defaultValues || APPLICANT_FORM_DEFAULT_VALUES,
  });
  const [currentMode, setCurrentMode] = useState(mode);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const config = useMemo(() => DIALOG_CONFIG[mode], [mode]);
  const queryClient = useQueryClient();
  const { addApplicant, updateApplicant } = useApplicantData();

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const isEditing = currentMode === "edit";
  const { control, formState: { isValid, isDirty, errors } } = form;
  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    console.log("Form is valid:", isValid);
  }, [isValid]);

  const addMutation = useMutation({
    mutationFn: addApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      toast.success("Applicant created");
      form.reset();
    },
    onError: (error) => {
      toast.error("Error creating applicant: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      toast.success("Applicant updated");
      setCurrentMode("view");
      setIsReadyToSave(false);
    },
    onError: (error) => {
      toast.error("Error updating applicant: " + (error instanceof Error ? error.message : "Unknown error"));
    },
  });

  async function onSubmit(values: z.infer<typeof formApplicantSchema>) {
    console.log("🚀 Form Data:", values);
    if (!isValid) {
      console.log("Form is invalid!");
      return;
    }

    if (currentMode === "create") {
      addMutation.mutate(values);
    } else if (currentMode === "edit" && isReadyToSave) {
      const updatedValues = { ...values, id: defaultValues?.id };
      updateMutation.mutate(updatedValues as any);
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
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>ข้อมูลส่วนตัว</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-2">
                {Object.entries(APPLICANT_FORM_FIELDS.info).map(([key, value]) => {
                  if (key === "address") {
                    return Object.values(value).map((item) => (
                      <FormField
                        key={item.id}
                        control={control}
                        name={`info.address.${item.id}` as `info.address.${keyof typeof APPLICANT_FORM_FIELDS.info.address}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                            <Label>{item.label}</Label>
                            <FormMessage />
                            <FormControl>
                              <Input
                                className="h-5 w-40 text-center"
                                {...field}
                                value={typeof field.value === "string" ? field.value : ""}
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ));
                  } else {
                    return (
                      <FormField
                        key={key}
                        control={control}
                        name={`info.${key}` as `info.${keyof typeof APPLICANT_FORM_FIELDS.info}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                            {"label" in value && <Label>{value.label}</Label>}
                            <FormMessage />
                            <FormControl>
                              <Input
                                className="h-5 w-40 text-center"
                                {...field}
                                value={typeof field.value === "string" ? field.value : ""}
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  }
                })}
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
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    return checked
                                      ? field.onChange([...currentValue, item.id])
                                      : field.onChange(currentValue.filter((value) => value !== item.id));
                                  }}
                                  disabled={currentMode === "view" && !isEditing}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.lable}</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
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
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    return checked
                                      ? field.onChange([...currentValue, item.id])
                                      : field.onChange(currentValue.filter((value) => value !== item.id));
                                  }}
                                  disabled={currentMode === "view" && !isEditing}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
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
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    return checked
                                      ? field.onChange([...currentValue, item.id])
                                      : field.onChange(currentValue.filter((value) => value !== item.id));
                                  }}
                                  disabled={currentMode === "view" && !isEditing}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
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

            <div className="col-span-2 grid grid-cols-5 gap-3">
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
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                }}
                                disabled={currentMode === "view" && !isEditing}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
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
                              value={typeof field.value === "string" ? field.value : ""}
                              disabled={currentMode === "view" && !isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
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
                            onChange={(date) => field.onChange(date.toISOString())}
                            disabled={currentMode === "view" && !isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-2 grid">
              <div className="flex justify-end gap-2">
                {(() => {
                  const modeButtons: Record<string, JSX.Element> = {
                    create: (
                      <Button
                        type="submit"
                        disabled={!isValid || addMutation.isPending || updateMutation.isPending}
                      >
                        <TiTick /> Create Applicant
                      </Button>
                    ),
                    edit: (
                      <Button
                        type="submit"
                        disabled={!isValid || !isDirty || addMutation.isPending || updateMutation.isPending}
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