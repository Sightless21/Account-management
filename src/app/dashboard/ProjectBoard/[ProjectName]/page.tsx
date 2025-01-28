"use client";
import { KanBanBoard } from '@/components/DnDKanBan/KanBanBoard';
import { useProjectStore } from "@/hooks/useProjectStore";
import ModalTask from '@/components/modal-Task';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const projectName = typeof params?.ProjectName === 'string' ? decodeURIComponent(params.ProjectName) : null;
    console.log("ProjectName : ", projectName);

    const { projects, fetchProjects } = useProjectStore();
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        // ดึงข้อมูลโปรเจกต์เมื่อ component ถูก mount
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        // หาว่า ProjectName ตรงกับโปรเจกต์ใด และตั้งค่า ProjectId
        if (projectName && projects.length > 0) {
            const matchedProject = projects.find((project) => project.projectName === projectName);
            if (matchedProject) {
                setProjectId(matchedProject.id);
                console.log("Matched Project ID:", matchedProject.id);
            } else {
                console.warn("No project found with the name:", projectName);
            }
        }
    }, [projectName, projects]);

    async function handleProjectPage() {
        router.push("/dashboard/ProjectBoard");
    }

    return (
        <div className='flex flex-col gap-4 ml-3 mr-3'>
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                Project : {projectName} Tasks {projectId ? `(${projectId})` : ''}
            </div>
            <div className='flex flex-col w-full h-full'>
                {/* ส่ง projectId ไปยัง KanBanBoard */}
                <div className="flex  ml-4 gap-3">
                    {/* Button */}
                    <Button variant={"outline"} onClick={handleProjectPage}><ChevronLeft />Project Page</Button>
                    <ModalTask mode="create" projectId={projectId} projectName={projectName || undefined} />
                </div>
                <KanBanBoard projectID={projectId} projectName={projectName} />
            </div>
        </div>
    );
}
