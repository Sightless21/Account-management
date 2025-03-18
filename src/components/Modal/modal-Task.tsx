"use client";

import { useState } from "react";
import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/ui/formCustomizeInput";
import { FormTextareaWithCount } from "@/components/ui/FormTextareaWithCount";
import { Task } from "@/types/projects";
import { FolderPen, User2 } from "lucide-react";

interface TaskModalProps {
  mode: "create" | "view-edit";
  defaultValues?: Task;
  onSave?: (task: Task) => void;
  trigger?: React.ReactNode;
  projectId?: string | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  taskName: z.string().min(2, { message: "Task name must be at least 2 characters." }),
  description: z.string().max(300, { message: "Description cannot exceed 300 characters." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"] as const),
  status: z.enum(["TODO", "DOING", "DONE"] as const),
  dueDate: z.date().optional(),
  assignee: z.string().optional(),
});

export function TaskModal({ mode, defaultValues, onSave, trigger, projectId }: TaskModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      dueDate: defaultValues.dueDate ? new Date(defaultValues.dueDate) : new Date(),
    } : {
      taskName: "",
      description: "",
      priority: "LOW",
      status: "TODO",
      dueDate: new Date(),
      assignee: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const task: Task = {
      ...values,
      id: values.id || defaultValues?.id || "", // Preserve ID for updates
      projectId: projectId || "",
      dueDate: values.dueDate || new Date(),
      assignee: values.assignee || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0
    };

    if (onSave) onSave(task); // Trigger the onSave callback

    toast.success(mode === "create" ? "Task created successfully" : "Task updated successfully");
    setOpen(false);

    if (mode === "create") {
      form.reset({
        taskName: "",
        description: "",
        priority: "LOW",
        status: "TODO",
        dueDate: new Date(),
        assignee: "",
      });
    }
  };

  const priorityOptions = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  const statusOptions = [
    { label: "To Do", value: "TODO" },
    { label: "In Progress", value: "DOING" },
    { label: "Done", value: "DONE" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            variant={mode === "create" ? "default" : "outline"}
            className="h-8 flex items-center gap-2"
          >
            <span>{mode === "create" ? "Create Task" : "Edit Task"}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create" ? "Create Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              name="taskName"
              label="Task Name"
              icon={FolderPen}
              placeholder="Enter task name"
              control={form.control}
              component="input"
              required
            />
            <FormTextareaWithCount form={form} name="description" maxChars={300} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="priority"
                label="Priority"
                control={form.control}
                component="radio"
                options={priorityOptions}
              />
              <FormInput
                name="status"
                label="Status"
                control={form.control}
                component="radio"
                options={statusOptions}
              />
            </div>
            <FormInput name="dueDate" label="Due Date" control={form.control} component="birthdate" />
            <FormInput
              name="assignee"
              label="Assignee"
              icon={User2}
              placeholder="Enter assignee name"
              control={form.control}
              component="input"
            />
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              {mode === "create" ? (
                <Button type="submit">Create</Button>
              ) : (
                <>
                  <Button type="submit" className="mr-2">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}