"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";


interface ModalProjectProps {
  createProject: (projectName: string, description?: string) => void; // อัปเดต type
}

export function ModalProject({ createProject }: ModalProjectProps) {
  // สถานะสำหรับเก็บชื่อโปรเจกต์และสถานะการตรวจสอบ
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState(""); // เพิ่ม state สำหรับ description
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
      createProject(projectName, description);
      // ปิด modal หลังจากส่งสำเร็จ
      if (dialogRef.current) {
        dialogRef.current.close();
      }
      setIsInputEmpty(false);
      setProjectName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[700px]">
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
            <div className="mb-5 grid gap-2">
              <Label htmlFor="Description">Description</Label>
              <Textarea
                id="Description"
                placeholder="Project description"
                className="w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
