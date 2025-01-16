/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { TiCancel, TiTick } from "react-icons/ti";

import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    projectName: z.string().min(2, {
        message: "Project name must be at least 2 characters.",
    }),
    taskName: z.string().min(2, {
        message: "Task name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    })
})


export default function ModalNewTask() {

    const [projectName, setProjectName] = useState("")
    const [taskName, setTaskName] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("Low")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectName: "",
            taskName: "",
            description: "",
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setProjectName(values.projectName)
        setTaskName(values.taskName)
        setDescription(values.description)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">New Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:w-[700px] min-h-28 ">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new task.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Form */}
                        <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="new-project" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* TaskName */}
                        <FormField
                            control={form.control}
                            name="taskName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="new-task" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl className="text-start">
                                        <Textarea placeholder="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh viverra non semper suscipit posuere a pede." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* DropDown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{priority}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Panel Priority</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={priority} onValueChange={setPriority}>
                                    <DropdownMenuRadioItem value="LOW" className="text-green-600">Low</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="MEDIUM" className="text-yellow-600">Medium</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="HIGH" className="text-red-600">High</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex flex-row justify-end gap-2">
                            <Button type="submit"> <TiTick />Submit</Button>
                            <Button type="button" variant={"destructive"} className="bg-red-600"> <TiCancel />Cancel</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}