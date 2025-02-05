'use client';
import { useEffect, useState, } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/hooks/useTaskStore";
import { ColumnType } from "../DnDKanBan/types";
import { toast } from "sonner";
import { z } from "zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormTextareaWithCount from "../ui/FormTextareaWithCount";

type TaskModalProps = {
    mode: "create" | "edit" | "view";
    defaultValues?: z.infer<typeof formSchema>;
    projectId?: string | null;
    setLoading?: (loading: boolean) => void
};

const formSchema = z.object({
    id: z.string().optional(),
    taskName: z.string().min(2, { message: "Task name must be at least 2 characters." }),
    description: z.string(),
    priority: z.string(),
    status: z.enum(["todo", "doing", "done"]).optional(),
    assignments: z.array(z.string().optional()).default([]),
});

export function TaskModal({ defaultValues, mode, projectId, setLoading }: TaskModalProps) {
    const [currentMode, setCurrentMode] = useState<"view" | "edit" | "create">(mode);
    const [priority, setPriority] = useState<string>(defaultValues?.priority || "LOW");
    const [charCount, setCharCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const { createTask, updateTasks } = useTaskStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: defaultValues || {
            id: "",
            taskName: "",
            description: "",
            priority: "LOW",
            status: "todo",
            assignments: [],
        },
    });

    // Handle description character count
    useEffect(() => {
        const description = form.watch("description");
        setCharCount(description?.length || 0);
    }, [form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (currentMode === "view") {
            return; // ไม่ทำงานหากอยู่ในโหมด view
        }
        console.log("submit form: ", values);
        const card = {
            projectId: projectId || "",
            id: values.id || "",
            taskName: values.taskName.trim(),
            description: values.description.trim(),
            priority: values.priority,
            status: (values.status as ColumnType) || "todo",
        };
        console.log("card form: ", card);
        // เรียก API หรือฟังก์ชันการทำงานอื่น ๆ ตามโหมด
        if (currentMode === "create") {
            if (charCount > 300) {
                setShowAlert(true);
                return;
            }
            if (!projectId) {
                toast.error("Project ID is required");
                return;
            }
            toast.promise(createTask(projectId, card), {
                loading: "Creating task...",
                success: "Task created",
                error: "Error creating task"
            })
        } else if (currentMode === "edit") {
            if (setLoading) setLoading(false);
            toast.promise(updateTasks(card), {
                loading: "Updating task...",
                success: "Task updated",
                error: "Error updating task"
            })
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {currentMode === "view" || currentMode === "edit" ? (
                        <Button variant="link" onClick={() => setCurrentMode("view")}>View Task</Button>
                    ) : (
                        <Button variant="default">Create Task</Button>
                    )}
                </DialogTrigger>
                <DialogContent className="w-[900px]">
                    <DialogHeader>
                        <DialogTitle>{currentMode === "view" ? "View Task" : currentMode === "edit" ? "Edit Task" : "Create Task"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="taskName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter task name"
                                                {...field}
                                                disabled={currentMode === "view"}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <FormTextareaWithCount
                                                form={form}
                                                disabled={currentMode === "view"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button disabled={currentMode === "view"} variant="outline">
                                        {priority || "Select Priority"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        onValueChange={(value) => {
                                            setPriority(value);
                                            form.setValue("priority", value);
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="HIGH">
                                            High
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="MEDIUM">
                                            Medium
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogFooter>
                                {currentMode === "view" ? (
                                    <Button type="button" onClick={() => setCurrentMode("edit")}>Edit</Button>
                                ) : currentMode === "create" ? (
                                    <Button type="submit">Create</Button>
                                ) : (
                                    <>
                                        <Button type="submit">Save Changes</Button>
                                        <Button type="button" variant="outline" onClick={() => setCurrentMode("view")}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Description Too Long</AlertDialogTitle>
                        <AlertDialogDescription>
                            The description cannot exceed 300 characters. Please shorten it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}