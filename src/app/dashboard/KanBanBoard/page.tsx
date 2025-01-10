"use client"
import { KanBanBoard } from '@/components/kanban-board';
import ModalNewTask from '@/components/modal-NewTask';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';


export default function Page() {

    const router = useRouter();

    function  handleProjectPage() {
        router.push("/dashboard/KanBanBoard/Project");
    }

    return (
        <div className='flex flex-col gap-4 ml-3 mr-3'>
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                Kanban Board
                <div className="flex ml-4 gap-3">
                    {/* Button */}
                    <ModalNewTask />
                    <Button onClick={handleProjectPage}>Project</Button>
                </div>
            </div>
            <KanBanBoard />
        </div>
    );
}