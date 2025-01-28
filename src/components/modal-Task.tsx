'use client'
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";
import { ColumnType } from "./DnDKanBan/types";
import { useTaskStore } from "@/hooks/useTaskStore";

interface TaskProps {
    defaultValues: z.infer<typeof formSchema>;
    projectId: string |  null;
    projectName?: string;
    mode?: "view" | "edit" | "create";
}

const formSchema = z.object({
    id: z.string().optional(),
    projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
    taskName: z.string().min(2, { message: "Task name must be at least 2 characters." }),
    description: z.string().min(2, { message: "Description must be at least 2 characters." }),
    status: z.string().optional(),
    priority: z.string().optional(),
});

const Field: React.FC<{
    name: keyof z.infer<typeof formSchema>;
    label: string;
    placeholder: string;
    disabled?: boolean;
    control: Control<z.infer<typeof formSchema>>;
    multiline?: boolean;
}> = ({ name, label, placeholder, disabled, control, multiline = false }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    {multiline ? (
                        <Textarea placeholder={placeholder} {...field} disabled={disabled} />
                    ) : (
                        <Input placeholder={placeholder} {...field} disabled={disabled} />
                    )}
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const ModalTask: React.FC<TaskProps> = ({ defaultValues, mode = "create" , projectId, projectName}) => {
    const [currentMode, setCurrentMode] = useState<"view" | "edit" | "create">(mode);
    const [priority, setPriority] = useState<string>(defaultValues?.priority || "LOW");
    const [project] = useState<string>(projectName || "");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: defaultValues || {
            id: "",
            projectName: project,
            taskName: "",
            description: "",
            status: "todo",
            priority: "LOW",
        },
    });

    const { isValid } = form.formState;

    const handleModeSwitch = (mode: "view" | "edit" | "create") => setCurrentMode(mode);
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            if (currentMode === "create") {
                await useTaskStore.getState().createTask(projectId || "", { ...values, id: values.id || "", status: (values.status || "todo") as ColumnType, priority: values.priority || "LOW", projectId: project, });
                form.reset();
            } else if (currentMode === "edit") {
                await useTaskStore.getState().updateTasks({ ...values, id: values.id || "", status: (values.status || "todo") as ColumnType, priority: values.priority || "LOW", projectId: project });
                setCurrentMode("view");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fieldData = [
        { name: "projectName", label: "Project Name", placeholder: "New Project" , disabled: true},
        { name: "taskName", label: "Task Name", placeholder: "New Task" },
        { name: "description", label: "Description", placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.", multiline: true },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {currentMode === "view" ||currentMode === "edit" ? (
                    <Button variant="link">View Task</Button>
                ) : (
                    <Button variant="default">Create Task</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:w-[700px] min-h-28">
                <DialogHeader>
                    <DialogTitle>
                        {currentMode === "view"
                            ? "View Task"
                            : currentMode === "edit"
                                ? "Edit Task"
                                : "Create Task"}
                    </DialogTitle>
                    <DialogDescription>
                        {currentMode === "view"
                            ? "View the task details."
                            : currentMode === "edit"
                                ? "Edit the task details."
                                : "Fill in the form below to create a new task."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {fieldData.map(({ name, label, placeholder, multiline , disabled }) => (
                            <Field
                                key={name}
                                name={name as keyof z.infer<typeof formSchema>}
                                label={label}
                                placeholder={placeholder}
                                disabled={disabled ?? currentMode === "view"}
                                control={form.control}
                                multiline={multiline}
                            />
                        ))}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={currentMode === "view"} variant="outline">{priority || "Select Priority"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup onValueChange={(value) => { setPriority(value); form.setValue("priority", value); }}>
                                    <DropdownMenuRadioItem value="HIGH">High</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="MEDIUM">Medium</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogFooter>
                            {currentMode === "view" && (
                                <Button variant="outline" onClick={() => handleModeSwitch("edit")}>
                                    Edit
                                </Button>
                            )}
                            {currentMode === "edit" && (
                                <Button variant="outline" onClick={() => handleModeSwitch("view")}>
                                    Cancel
                                </Button>
                            )}
                            {currentMode !== "view" && (
                                <Button type="submit" disabled={!isValid}>
                                    {currentMode === "create" ? "Create" : "Save"}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalTask;