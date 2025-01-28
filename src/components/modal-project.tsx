'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalProjectProps {
    createProject: (projectName: string) => void;
}

export function ModalProject({createProject}: ModalProjectProps) {
    // สถานะสำหรับเก็บชื่อโปรเจกต์และสถานะการตรวจสอบ
    const [projectName, setProjectName] = useState("");
    const [isInputEmpty, setIsInputEmpty] = useState(false);

    // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // ตรวจสอบว่าค่าที่กรอกไม่ใช่ค่าว่าง
        if (!projectName.trim()) {
            setIsInputEmpty(true);
            return;
        }
        setIsInputEmpty(false);
        console.log("Project Name:", projectName);

        // ส่งข้อมูลโปรเจกต์ไปยัง API
        return createProject(projectName);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Create Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        This will create a new name for your project.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <div className="grid gap-2 mb-2">
                            <Label htmlFor="Project">Project Name</Label>
                            <Input
                                id="Project"
                                placeholder="Tenkei"
                                className="w-full"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>
                        {/* แสดงข้อความเตือนเมื่อค่าว่าง */}
                        {isInputEmpty && (
                            <p className="text-red-500 text-sm">
                                Project name is required.
                            </p>
                        )}
                    </div>
                    <DialogFooter className="space-x-2">
                        <Button type="submit">Create</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="destructive" >
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
