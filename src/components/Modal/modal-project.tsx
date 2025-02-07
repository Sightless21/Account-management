"use client";

import { useState, useRef } from "react";
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

//DONE : Modal Project
export function ModalProject({ createProject }: ModalProjectProps) {
  // สถานะสำหรับเก็บชื่อโปรเจกต์และสถานะการตรวจสอบ
  const [projectName, setProjectName] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  // สร้าง ref สำหรับ Dialog
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
       // ตรวจสอบว่าค่าที่กรอกไม่ใช่ค่าว่าง
    if (!projectName.trim()) {
      setIsInputEmpty(true);
      return;
    }
    // ส่งข้อมูลโปรเจกต์ไปยัง API
    createProject(projectName);
    // ปิด modal หลังจากส่งสำเร็จ
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setIsInputEmpty(false);
    setProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
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
            <div className="mb-2 grid gap-2">
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
              <p className="text-sm text-red-500">Project name is required.</p>
            )}
          </div>
          <DialogFooter className="space-x-2">
            <Button type="submit">Create</Button>
            <DialogClose asChild>
              <Button type="button" variant="destructive">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
